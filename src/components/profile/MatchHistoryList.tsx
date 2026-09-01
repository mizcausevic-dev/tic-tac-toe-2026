import { Handshake, Trophy, XCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useProfile } from "@/features/profile/context"
import type { MatchRecord, MatchResult } from "@/features/profile/types"
import { formatRelativeTime } from "@/lib/relativeTime"
import { cn } from "@/lib/utils"

const RESULT_META: Record<MatchResult, { label: string; icon: typeof Trophy; color: string }> = {
  win: { label: "Win", icon: Trophy, color: "var(--mark-x)" },
  loss: { label: "Loss", icon: XCircle, color: "var(--destructive)" },
  draw: { label: "Draw", icon: Handshake, color: "var(--secondary)" },
}

const OPPONENT_LABEL: Record<MatchRecord["opponent"], string> = {
  local: "Pass & play",
  "ai-easy": "AI · Easy",
  "ai-medium": "AI · Medium",
  "ai-hard": "AI · Hard",
}

export function MatchHistoryList() {
  const { state } = useProfile()
  const matches = [...state.history].reverse()

  if (matches.length === 0) {
    return (
      <p className="glass-panel rounded-2xl p-6 text-center text-sm text-muted-foreground">
        No matches yet — play one to start building your history.
      </p>
    )
  }

  return (
    <ScrollArea className="glass-panel h-72 rounded-2xl">
      <ul className="divide-y divide-white/5">
        {matches.map((match) => {
          const meta = RESULT_META[match.result]
          const Icon = meta.icon
          return (
            <li key={match.id} className="flex items-center gap-3 px-4 py-3">
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-full"
                style={{
                  color: meta.color,
                  background: `color-mix(in oklab, ${meta.color} 16%, transparent)`,
                }}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm font-semibold")} style={{ color: meta.color }}>
                    {meta.label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {OPPONENT_LABEL[match.opponent]}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {match.boardSize}×{match.boardSize} · {match.winLength} in a row ·{" "}
                  {match.movesPlayed} moves
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-sm text-violet">+{match.xpEarned} XP</p>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeTime(match.playedAt)}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </ScrollArea>
  )
}
