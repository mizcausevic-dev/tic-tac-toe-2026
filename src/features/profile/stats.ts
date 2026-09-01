import type { MatchRecord } from "./types"

export interface DerivedStats {
  totalMatches: number
  wins: number
  losses: number
  draws: number
  /** Wins / totalMatches, 0..1. */
  winRate: number
  /** Consecutive wins counting back from the most recent match; 0 if it wasn't a win. */
  currentStreak: number
}

/** Always computed from history, never stored — there is exactly one source of truth. */
export function computeStats(history: readonly MatchRecord[]): DerivedStats {
  let wins = 0
  let losses = 0
  let draws = 0

  for (const match of history) {
    if (match.result === "win") wins += 1
    else if (match.result === "loss") losses += 1
    else draws += 1
  }

  const totalMatches = history.length
  const winRate = totalMatches === 0 ? 0 : wins / totalMatches

  let currentStreak = 0
  for (let i = history.length - 1; i >= 0; i -= 1) {
    if (history[i].result !== "win") break
    currentStreak += 1
  }

  return { totalMatches, wins, losses, draws, winRate, currentStreak }
}
