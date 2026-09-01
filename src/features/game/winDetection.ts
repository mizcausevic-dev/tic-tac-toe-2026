import type { CellValue, Mark, WinResult } from "./types"

/** The 4 axis-pairs that cover all 8 scan directions (each pair is checked ± from the origin). */
const DIRECTIONS: ReadonlyArray<readonly [number, number]> = [
  [0, 1], // horizontal
  [1, 0], // vertical
  [1, 1], // diagonal ↘/↖
  [1, -1], // diagonal ↙/↗
]

export function indexToRowCol(index: number, boardSize: number): [number, number] {
  return [Math.floor(index / boardSize), index % boardSize]
}

export function rowColToIndex(row: number, col: number, boardSize: number): number {
  return row * boardSize + col
}

function inBounds(row: number, col: number, boardSize: number): boolean {
  return row >= 0 && row < boardSize && col >= 0 && col < boardSize
}

/**
 * Scans outward from the just-played cell along all 8 directions and returns the
 * winning run as soon as one reaches `winLength`. No hardcoded line tables: this
 * is what makes the same function correct for a 3x3/3-in-a-row match and a
 * 10x10/5-in-a-row match alike. Cost is O(boardSize) per call, not O(boardSize^2),
 * because only the four lines through the new mark can possibly have changed.
 */
export function checkWinAt(
  board: readonly CellValue[],
  boardSize: number,
  winLength: number,
  playedIndex: number
): WinResult | null {
  const mark = board[playedIndex]
  if (!mark) return null

  const [row, col] = indexToRowCol(playedIndex, boardSize)

  for (const [dr, dc] of DIRECTIONS) {
    const line = [playedIndex]

    let r = row + dr
    let c = col + dc
    while (inBounds(r, c, boardSize) && board[rowColToIndex(r, c, boardSize)] === mark) {
      line.push(rowColToIndex(r, c, boardSize))
      r += dr
      c += dc
    }

    r = row - dr
    c = col - dc
    while (inBounds(r, c, boardSize) && board[rowColToIndex(r, c, boardSize)] === mark) {
      line.push(rowColToIndex(r, c, boardSize))
      r -= dr
      c -= dc
    }

    if (line.length >= winLength) {
      return { mark, line }
    }
  }

  return null
}

export function isBoardFull(board: readonly CellValue[]): boolean {
  return board.every((cell) => cell !== null)
}

/** Simulates placing `mark` at `index` and reports whether it would win. Used by the AI. */
export function wouldWin(
  board: readonly CellValue[],
  boardSize: number,
  winLength: number,
  index: number,
  mark: Mark
): boolean {
  if (board[index] !== null) return false
  const next = board.slice()
  next[index] = mark
  return checkWinAt(next, boardSize, winLength, index) !== null
}
