import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react"
import type { GameState } from "./types"
import { DEFAULT_CONFIG } from "./types"
import { createInitialState, gameReducer, type GameAction } from "./reducer"

interface GameContextValue {
  state: GameState
  dispatch: Dispatch<GameAction>
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, DEFAULT_CONFIG, createInitialState)
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error("useGame must be used within a GameProvider")
  return ctx
}
