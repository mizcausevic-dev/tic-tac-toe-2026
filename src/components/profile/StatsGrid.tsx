import { useMemo } from "react"
import { useProfile } from "@/features/profile/context"
import { computeStats } from "@/features/profile/stats"

export function StatsGrid() {
  const { state } = useProfile()
  const stats = useMemo(() => computeStats(state.history), [state.history])

  const tiles: Array<{ label: string; value: string | number }> = [
    { label: "Wins", value: stats.wins },
    { label: "Losses", value: stats.losses },
    { label: "Draws", value: stats.draws },
    { label: "Win rate", value: `${Math.round(stats.winRate * 100)}%` },
    { label: "Streak", value: stats.currentStreak },
  ]

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-2 py-3 text-center"
        >
          <span className="font-mono text-xl font-bold text-primary">{tile.value}</span>
          <span className="text-xs text-muted-foreground">{tile.label}</span>
        </div>
      ))}
    </div>
  )
}
