import type { AiDifficulty, CellValue, Mark } from "./types"
import { checkWinAt, indexToRowCol, isBoardFull, rowColToIndex, wouldWin } from "./winDetection"

function emptyIndices(board: readonly CellValue[]): number[] {
  const result: number[] = []
  board.forEach((value, index) => {
    if (value === null) result.push(index)
  })
  return result
}

export function randomMove(board: readonly CellValue[]): number {
  const empties = emptyIndices(board)
  return empties[Math.floor(Math.random() * empties.length)]
}

/**
 * Take a winning move if one exists, else block the opponent's, else prefer
 * the center, else a corner, else random. No search — just tactics.
 */
export function heuristicMove(
  board: readonly CellValue[],
  boardSize: number,
  winLength: number,
  aiMark: Mark,
  humanMark: Mark
): number {
  const empties = emptyIndices(board)

  for (const i of empties) {
    if (wouldWin(board, boardSize, winLength, i, aiMark)) return i
  }
  for (const i of empties) {
    if (wouldWin(board, boardSize, winLength, i, humanMark)) return i
  }

  if (boardSize % 2 === 1) {
    const mid = Math.floor(boardSize / 2)
    const center = rowColToIndex(mid, mid, boardSize)
    if (board[center] === null) return center
  }

  const corners = [
    rowColToIndex(0, 0, boardSize),
    rowColToIndex(0, boardSize - 1, boardSize),
    rowColToIndex(boardSize - 1, 0, boardSize),
    rowColToIndex(boardSize - 1, boardSize - 1, boardSize),
  ].filter((i) => board[i] === null)
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)]
  }

  return empties[Math.floor(Math.random() * empties.length)]
}

// ---- Hard difficulty: bounded minimax with alpha-beta pruning ----
//
// Full exhaustive minimax is only tractable on a 3x3 board (<=9 cells). On
// larger boards the branching factor makes it explode combinatorially, so
// "hard" instead: (1) always takes an immediate win or block first — a cheap
// check that guarantees the bot never misses an obvious tactic regardless of
// search depth, (2) restricts the search to empty cells within a radius of
// existing marks (moves far from the action are never worth considering in
// N-in-a-row games), and (3) scales the search depth down as that candidate
// set grows, so worst-case node count stays bounded on any board size.

const WIN_SCORE = 1_000_000
const CANDIDATE_RADIUS = 2

interface SearchContext {
  boardSize: number
  winLength: number
  aiMark: Mark
  humanMark: Mark
}

function candidateMoves(board: readonly CellValue[], boardSize: number): number[] {
  const occupied = board.reduce<number[]>((acc, v, i) => {
    if (v !== null) acc.push(i)
    return acc
  }, [])

  if (occupied.length === 0) {
    const mid = Math.floor(boardSize / 2)
    return [rowColToIndex(mid, mid, boardSize)]
  }

  const candidates = new Set<number>()
  for (const idx of occupied) {
    const [row, col] = indexToRowCol(idx, boardSize)
    for (let dr = -CANDIDATE_RADIUS; dr <= CANDIDATE_RADIUS; dr += 1) {
      for (let dc = -CANDIDATE_RADIUS; dc <= CANDIDATE_RADIUS; dc += 1) {
        const r = row + dr
        const c = col + dc
        if (r < 0 || r >= boardSize || c < 0 || c >= boardSize) continue
        const i = rowColToIndex(r, c, boardSize)
        if (board[i] === null) candidates.add(i)
      }
    }
  }
  return Array.from(candidates)
}

function searchDepthFor(candidateCount: number): number {
  if (candidateCount <= 9) return 4
  if (candidateCount <= 16) return 3
  return 2
}

/** Windowed threat scoring: every `winLength`-cell window scores for whichever mark owns it alone. */
function evaluateBoard(board: readonly CellValue[], ctx: SearchContext): number {
  const { boardSize, winLength, aiMark, humanMark } = ctx
  const directions: ReadonlyArray<readonly [number, number]> = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ]

  let score = 0
  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      for (const [dr, dc] of directions) {
        const endRow = row + dr * (winLength - 1)
        const endCol = col + dc * (winLength - 1)
        if (endRow < 0 || endRow >= boardSize || endCol < 0 || endCol >= boardSize) continue

        let self = 0
        let opp = 0
        for (let k = 0; k < winLength; k += 1) {
          const cell = board[rowColToIndex(row + dr * k, col + dc * k, boardSize)]
          if (cell === aiMark) self += 1
          else if (cell === humanMark) opp += 1
        }

        if (self > 0 && opp > 0) continue // dead window, no potential either way
        if (self > 0) score += 10 ** self
        else if (opp > 0) score -= 10 ** opp
      }
    }
  }
  return score
}

function minimax(
  board: CellValue[],
  ctx: SearchContext,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  lastMove: number
): number {
  const win = checkWinAt(board, ctx.boardSize, ctx.winLength, lastMove)
  if (win) {
    const aiWon = win.mark === ctx.aiMark
    return aiWon ? WIN_SCORE + depth : -WIN_SCORE - depth
  }
  if (isBoardFull(board)) return 0
  if (depth === 0) return evaluateBoard(board, ctx)

  const moves = candidateMoves(board, ctx.boardSize)
  const mark = isMaximizing ? ctx.aiMark : ctx.humanMark
  let best = isMaximizing ? -Infinity : Infinity

  for (const move of moves) {
    board[move] = mark
    const value = minimax(board, ctx, depth - 1, !isMaximizing, alpha, beta, move)
    board[move] = null

    if (isMaximizing) {
      best = Math.max(best, value)
      alpha = Math.max(alpha, value)
    } else {
      best = Math.min(best, value)
      beta = Math.min(beta, value)
    }
    if (beta <= alpha) break
  }

  return best
}

export function hardMove(
  board: readonly CellValue[],
  boardSize: number,
  winLength: number,
  aiMark: Mark,
  humanMark: Mark
): number {
  const empties = emptyIndices(board)

  for (const i of empties) {
    if (wouldWin(board, boardSize, winLength, i, aiMark)) return i
  }
  for (const i of empties) {
    if (wouldWin(board, boardSize, winLength, i, humanMark)) return i
  }

  const ctx: SearchContext = { boardSize, winLength, aiMark, humanMark }
  const working = board.slice()
  const moves = candidateMoves(working, boardSize)
  const depth = searchDepthFor(moves.length)

  let bestMove = moves[0] ?? empties[0]
  let bestScore = -Infinity

  for (const move of moves) {
    working[move] = aiMark
    const score = minimax(working, ctx, depth - 1, false, -Infinity, Infinity, move)
    working[move] = null
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}

export function chooseAiMove(
  difficulty: AiDifficulty,
  board: readonly CellValue[],
  boardSize: number,
  winLength: number,
  aiMark: Mark,
  humanMark: Mark
): number {
  if (difficulty === "easy") return randomMove(board)
  if (difficulty === "medium") return heuristicMove(board, boardSize, winLength, aiMark, humanMark)
  return hardMove(board, boardSize, winLength, aiMark, humanMark)
}
