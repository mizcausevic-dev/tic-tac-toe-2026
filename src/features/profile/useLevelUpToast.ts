import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useProfile } from "./context"
import { levelProgressFromXp } from "./xp"

/** Fires a toast the moment totalXp crosses into a new level. Silent on first mount. */
export function useLevelUpToast() {
  const { state } = useProfile()
  const level = levelProgressFromXp(state.totalXp).level
  const previousLevel = useRef(level)

  useEffect(() => {
    if (level > previousLevel.current) {
      toast.success(`Level up! You're now level ${level}.`, {
        description: "Keep playing to push the streak further.",
      })
    }
    previousLevel.current = level
  }, [level])
}
