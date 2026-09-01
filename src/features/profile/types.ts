export type OpponentKind = "local" | "ai-easy" | "ai-medium" | "ai-hard"
export type MatchResult = "win" | "loss" | "draw"

export interface Profile {
  name: string
  avatar: string
  createdAt: string
  updatedAt: string
}

export interface MatchRecord {
  id: string
  playedAt: string
  opponent: OpponentKind
  boardSize: number
  winLength: number
  /** Always from the profile owner's perspective (they always play X). */
  result: MatchResult
  movesPlayed: number
  xpEarned: number
}

export interface ProfileState {
  version: 1
  profile: Profile
  history: MatchRecord[]
  totalXp: number
}

export const PROFILE_STORAGE_KEY = "ttt2026:v1:profile"
/** History is capped and trimmed oldest-first; totalXp is tracked separately so trimming never loses XP. */
export const MAX_HISTORY_ENTRIES = 200

export const AVATAR_CHOICES = [
  "🐯",
  "🦊",
  "🐺",
  "🦉",
  "🐙",
  "🦄",
  "🐲",
  "🦅",
  "🐸",
  "🦁",
  "🐨",
  "🐼",
] as const

export function createDefaultProfile(): ProfileState {
  const now = new Date().toISOString()
  return {
    version: 1,
    profile: {
      name: "Player One",
      avatar: AVATAR_CHOICES[0],
      createdAt: now,
      updatedAt: now,
    },
    history: [],
    totalXp: 0,
  }
}
