export type Mark = "X" | "O"
export type CellValue = Mark | null

export type OpponentType = "local" | "ai"
export type AiDifficulty = "easy" | "medium" | "hard"

export interface GameConfig {
  boardSize: number
  winLength: number
  opponent: OpponentType
  aiDifficulty: AiDifficulty
}

export interface WinResult {
  mark: Mark
  /** Flat board indices that make up the winning run, in scan order. */
  line: number[]
}

export type GameStatus = "setup" | "playing" | "won" | "draw"

export interface SessionScore {
  X: number
  O: number
}

export interface GameState {
  config: GameConfig
  board: CellValue[]
  currentPlayer: Mark
  status: GameStatus
  winner: WinResult | null
  moveCount: number
  /** Wins per mark across rematches in this setup — reset by NEW_SETUP, kept across RESET_MATCH. */
  sessionScore: SessionScore
}

export const HUMAN_MARK: Mark = "X"
export const OPPONENT_MARK: Mark = "O"

export const MIN_BOARD_SIZE = 3
export const MAX_BOARD_SIZE = 10
export const BOARD_SIZE_PRESETS = [3, 4, 5, 6, 8, 10] as const

export const MIN_WIN_LENGTH = 3
export const MAX_WIN_LENGTH = 5
export const WIN_LENGTH_PRESETS = [3, 4, 5] as const

export const DEFAULT_CONFIG: GameConfig = {
  boardSize: 3,
  winLength: 3,
  opponent: "ai",
  aiDifficulty: "medium",
}

/** Win length can never exceed the board dimension, even if a caller asks for one that does. */
export function clampWinLength(boardSize: number, winLength: number): number {
  return Math.min(winLength, boardSize, MAX_WIN_LENGTH)
}

export function isValidConfig(config: GameConfig): boolean {
  return (
    config.boardSize >= MIN_BOARD_SIZE &&
    config.boardSize <= MAX_BOARD_SIZE &&
    config.winLength >= MIN_WIN_LENGTH &&
    config.winLength <= config.boardSize
  )
}
