import { useMemo } from "react"
import { Flame, Handshake, Percent, Trophy, XCircle } from "lucide-react"
import { useProfile } from "@/features/profile/context"
import { computeStats } from "@/features/profile/stats"

export function StatsGrid() {
  const { state } = useProfile()
  const stats = useMemo(() => computeStats(state.history), [state.history])

  const tiles: Array<{
    label: string
    value: string | number
    icon: typeof Trophy
    color: string
  }> = [
    { label: "Wins", value: stats.wins, icon: Trophy, color: "var(--mark-x)" },
    { label: "Losses", value: stats.losses, icon: XCircle, color: "var(--destructive)" },
    { label: "Draws", value: stats.draws, icon: Handshake, color: "var(--secondary)" },
    {
      label: "Win rate",
      value: `${Math.round(stats.winRate * 100)}%`,
      icon: Percent,
      color: "var(--violet)",
    },
    { label: "Streak", value: stats.currentStreak, icon: Flame, color: "var(--mark-o)" },
  ]

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {tiles.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="glass-panel flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-center"
          style={{ boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${color} 22%, transparent)` }}
        >
          <Icon className="size-4" style={{ color }} />
          <span className="font-mono text-xl font-bold tabular-nums" style={{ color }}>
            {value}
          </span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  )
}
