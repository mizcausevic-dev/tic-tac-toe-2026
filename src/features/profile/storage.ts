import { PROFILE_STORAGE_KEY, createDefaultProfile, type ProfileState } from "./types"

function isProfileStateV1(value: unknown): value is ProfileState {
  if (!value || typeof value !== "object") return false
  const v = value as Record<string, unknown>
  return (
    v.version === 1 &&
    typeof v.profile === "object" &&
    v.profile !== null &&
    Array.isArray(v.history) &&
    typeof v.totalXp === "number"
  )
}

/**
 * Versioned load with a safe fallback. A future schema bump adds a branch here
 * (e.g. `if (parsed.version === 1) return migrateV1ToV2(parsed)`) ahead of the
 * final fallback, so old saves upgrade instead of vanishing.
 */
export function loadProfileState(): ProfileState {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return createDefaultProfile()
    const parsed: unknown = JSON.parse(raw)
    if (isProfileStateV1(parsed)) return parsed
    return createDefaultProfile()
  } catch {
    return createDefaultProfile()
  }
}

export function saveProfileState(state: ProfileState): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Private browsing / quota exceeded: the session still works, it just won't persist.
  }
}
