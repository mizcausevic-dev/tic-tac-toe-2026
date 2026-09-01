import type { MatchRecord, ProfileState } from "./types"
import { MAX_HISTORY_ENTRIES } from "./types"
import { XP_REWARDS } from "./xp"

export type ProfileAction =
  | { type: "UPDATE_PROFILE"; name?: string; avatar?: string }
  | { type: "RECORD_MATCH"; match: Omit<MatchRecord, "id" | "playedAt" | "xpEarned"> }
  | { type: "RESET_STATS" }

export function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case "UPDATE_PROFILE": {
      return {
        ...state,
        profile: {
          ...state.profile,
          name: action.name?.trim() ? action.name.trim() : state.profile.name,
          avatar: action.avatar ?? state.profile.avatar,
          updatedAt: new Date().toISOString(),
        },
      }
    }

    case "RECORD_MATCH": {
      const xpEarned = XP_REWARDS[action.match.result]
      const record: MatchRecord = {
        ...action.match,
        id: crypto.randomUUID(),
        playedAt: new Date().toISOString(),
        xpEarned,
      }
      const history = [...state.history, record].slice(-MAX_HISTORY_ENTRIES)
      return {
        ...state,
        history,
        totalXp: state.totalXp + xpEarned,
      }
    }

    case "RESET_STATS": {
      return { ...state, history: [], totalXp: 0 }
    }

    default:
      return state
  }
}
