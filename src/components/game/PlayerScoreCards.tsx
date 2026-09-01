import type { CSSProperties } from "react"
import { motion } from "framer-motion"
import { useGame } from "@/features/game/context"
import type { AiDifficulty, Mark, OpponentType } from "@/features/game/types"
import { cn } from "@/lib/utils"

function playerLabel(mark: Mark, opponent: OpponentType, aiDifficulty: AiDifficulty): string {
  if (opponent === "local") return mark === "X" ? "Player 1" : "Player 2"
  return mark === "X" ? "You" : `AI · ${aiDifficulty}`
}

export function PlayerScoreCards() {
  const { state } = useGame()
  const { config, currentPlayer, status, winner, sessionScore } = state

  return (
    <div className="flex gap-3">
      {(["X", "O"] as const).map((mark) => {
        const isActive = status === "playing" && currentPlayer === mark
        const isWinner = status === "won" && winner?.mark === mark
        const highlighted = isActive || isWinner
        const color = mark === "X" ? "var(--mark-x)" : "var(--mark-o)"

        return (
          <motion.div
            key={mark}
            layout
            animate={isWinner ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
              "flex flex-1 items-center gap-3 rounded-2xl px-4 py-3",
              highlighted ? "turn-glow" : "border border-border bg-card/50 opacity-60"
            )}
            style={{ "--glow-color": color } as CSSProperties}
          >
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full text-xl font-bold",
                isActive && "animate-float"
              )}
              style={{
                color,
                background: `color-mix(in oklab, ${color} 18%, transparent)`,
              }}
              aria-hidden="true"
            >
              {mark}
            </div>
            <div className="min-w-0">
              <p
                className="font-mono text-2xl leading-none font-bold tabular-nums"
                style={{ color }}
              >
                {sessionScore[mark]}
              </p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {playerLabel(mark, config.opponent, config.aiDifficulty)}
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
