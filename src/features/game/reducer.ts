import type { CellValue, GameConfig, GameState } from "./types"
import { DEFAULT_CONFIG, HUMAN_MARK, clampWinLength, isValidConfig } from "./types"
import { checkWinAt, isBoardFull } from "./winDetection"

export type GameAction =
  | { type: "CONFIGURE"; config: Partial<GameConfig> }
  | { type: "START_MATCH"; config?: Partial<GameConfig> }
  | { type: "PLACE_MARK"; index: number }
  | { type: "RESET_MATCH" }
  | { type: "NEW_SETUP" }

function emptyBoard(boardSize: number): CellValue[] {
  return Array(boardSize * boardSize).fill(null)
}

export function createInitialState(config: GameConfig = DEFAULT_CONFIG): GameState {
  return {
    config,
    board: emptyBoard(config.boardSize),
    currentPlayer: HUMAN_MARK,
    status: "setup",
    winner: null,
    moveCount: 0,
    sessionScore: { X: 0, O: 0 },
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "CONFIGURE": {
      const merged: GameConfig = { ...state.config, ...action.config }
      merged.winLength = clampWinLength(merged.boardSize, merged.winLength)
      if (!isValidConfig(merged)) return state
      return { ...state, config: merged }
    }

    case "START_MATCH": {
      let config = state.config
      if (action.config) {
        config = { ...state.config, ...action.config }
        config.winLength = clampWinLength(config.boardSize, config.winLength)
      }
      if (!isValidConfig(config)) return state
      return {
        config,
        board: emptyBoard(config.boardSize),
        currentPlayer: HUMAN_MARK,
        status: "playing",
        winner: null,
        moveCount: 0,
        sessionScore: { X: 0, O: 0 },
      }
    }

    case "PLACE_MARK": {
      if (state.status !== "playing") return state
      if (state.board[action.index] !== null) return state

      const board = state.board.slice()
      board[action.index] = state.currentPlayer
      const moveCount = state.moveCount + 1

      const winner = checkWinAt(board, state.config.boardSize, state.config.winLength, action.index)
      if (winner) {
        return {
          ...state,
          board,
          moveCount,
          status: "won",
          winner,
          sessionScore: {
            ...state.sessionScore,
            [winner.mark]: state.sessionScore[winner.mark] + 1,
          },
        }
      }
      if (isBoardFull(board)) {
        return { ...state, board, moveCount, status: "draw" }
      }
      return {
        ...state,
        board,
        moveCount,
        currentPlayer: state.currentPlayer === "X" ? "O" : "X",
      }
    }

    case "RESET_MATCH": {
      return {
        ...state,
        board: emptyBoard(state.config.boardSize),
        currentPlayer: HUMAN_MARK,
        status: "playing",
        winner: null,
        moveCount: 0,
      }
    }

    case "NEW_SETUP": {
      return { ...state, status: "setup", winner: null }
    }

    default:
      return state
  }
}
