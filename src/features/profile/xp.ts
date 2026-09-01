export const XP_REWARDS = {
  win: 30,
  draw: 10,
  loss: 5,
} as const satisfies Record<"win" | "draw" | "loss", number>

/** XP required to advance from `level` to `level + 1`. */
export function xpThresholdForLevel(level: number): number {
  return Math.round(100 * level ** 1.5)
}

export interface LevelProgress {
  level: number
  xpIntoLevel: number
  xpForNextLevel: number
  /** 0..1 progress toward the next level. */
  progress: number
}

/** Level and progress bar are always derived from cumulative totalXp, never stored on their own. */
export function levelProgressFromXp(totalXp: number): LevelProgress {
  let level = 1
  let remaining = totalXp
  let threshold = xpThresholdForLevel(level)

  while (remaining >= threshold) {
    remaining -= threshold
    level += 1
    threshold = xpThresholdForLevel(level)
  }

  return {
    level,
    xpIntoLevel: remaining,
    xpForNextLevel: threshold,
    progress: threshold === 0 ? 0 : remaining / threshold,
  }
}
