import { useEffect } from "react"
import { chooseAiMove } from "./ai"
import { useGame } from "./context"
import { HUMAN_MARK, OPPONENT_MARK, type GameState } from "./types"

/** Small delay before the AI replies — an instant move reads as robotic and hides the "thinking" state. */
const AI_MOVE_DELAY_MS = 450

/** Drives the AI's turn: watches for "it's the bot's move" and dispatches PLACE_MARK after a short delay. */
export function useAiOpponent() {
  const { state, dispatch } = useGame()
  const { status, config, currentPlayer, board } = state

  useEffect(() => {
    if (status !== "playing") return
    if (config.opponent !== "ai") return
    if (currentPlayer !== OPPONENT_MARK) return

    const timer = setTimeout(() => {
      const index = chooseAiMove(
        config.aiDifficulty,
        board,
        config.boardSize,
        config.winLength,
        OPPONENT_MARK,
        HUMAN_MARK
      )
      dispatch({ type: "PLACE_MARK", index })
    }, AI_MOVE_DELAY_MS)

    return () => clearTimeout(timer)
  }, [status, config, currentPlayer, board, dispatch])
}

export function isAiThinking(state: GameState): boolean {
  return (
    state.status === "playing" &&
    state.config.opponent === "ai" &&
    state.currentPlayer === OPPONENT_MARK
  )
}
