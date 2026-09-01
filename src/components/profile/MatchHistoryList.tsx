import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useProfile } from "@/features/profile/context"
import type { MatchRecord, MatchResult } from "@/features/profile/types"
import { formatRelativeTime } from "@/lib/relativeTime"

const RESULT_LABEL: Record<MatchResult, string> = {
  win: "Win",
  loss: "Loss",
  draw: "Draw",
}

const OPPONENT_LABEL: Record<MatchRecord["opponent"], string> = {
  local: "Pass & play",
  "ai-easy": "AI · Easy",
  "ai-medium": "AI · Medium",
  "ai-hard": "AI · Hard",
}

function resultVariant(result: MatchResult): "default" | "secondary" | "outline" {
  if (result === "win") return "default"
  if (result === "draw") return "secondary"
  return "outline"
}

export function MatchHistoryList() {
  const { state } = useProfile()
  const matches = [...state.history].reverse()

  if (matches.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        No matches yet — play one to start building your history.
      </p>
    )
  }

  return (
    <ScrollArea className="h-72 rounded-xl border border-border">
      <ul className="divide-y divide-border">
        {matches.map((match) => (
          <li key={match.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant={resultVariant(match.result)}>{RESULT_LABEL[match.result]}</Badge>
                <span className="text-sm text-muted-foreground">
                  {OPPONENT_LABEL[match.opponent]}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {match.boardSize}×{match.boardSize} · {match.winLength} in a row ·{" "}
                {match.movesPlayed} moves
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-sm text-primary">+{match.xpEarned} XP</p>
              <p className="text-xs text-muted-foreground">{formatRelativeTime(match.playedAt)}</p>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}
