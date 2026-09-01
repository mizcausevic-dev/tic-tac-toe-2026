import { useEffect, useRef } from "react"
import { useGame } from "@/features/game/context"
import { HUMAN_MARK } from "@/features/game/types"
import { useProfile } from "@/features/profile/context"
import type { MatchResult, OpponentKind } from "@/features/profile/types"

/**
 * Bridges the two independent state slices: watches game status for a
 * won/draw transition and records exactly one match into the profile's
 * history + XP. A ref guards against double-recording across re-renders,
 * and resets the moment a new match starts.
 */
export function useMatchRecorder() {
  const { state: gameState } = useGame()
  const { dispatch: profileDispatch } = useProfile()
  const recordedRef = useRef(false)

  useEffect(() => {
    if (gameState.status === "playing") {
      recordedRef.current = false
      return
    }

    if (gameState.status !== "won" && gameState.status !== "draw") return
    if (recordedRef.current) return
    recordedRef.current = true

    const result: MatchResult =
      gameState.status === "draw" ? "draw" : gameState.winner?.mark === HUMAN_MARK ? "win" : "loss"

    const opponent: OpponentKind =
      gameState.config.opponent === "local" ? "local" : `ai-${gameState.config.aiDifficulty}`

    profileDispatch({
      type: "RECORD_MATCH",
      match: {
        opponent,
        boardSize: gameState.config.boardSize,
        winLength: gameState.config.winLength,
        result,
        movesPlayed: gameState.moveCount,
      },
    })
  }, [gameState.status, gameState.winner, gameState.moveCount, gameState.config, profileDispatch])
}
