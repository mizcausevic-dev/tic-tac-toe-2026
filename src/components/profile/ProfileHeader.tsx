import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useProfile } from "@/features/profile/context"
import { levelProgressFromXp } from "@/features/profile/xp"

interface ProfileHeaderProps {
  onEdit: () => void
}

export function ProfileHeader({ onEdit }: ProfileHeaderProps) {
  const { state } = useProfile()
  const { profile, totalXp } = state
  const { level, xpIntoLevel, xpForNextLevel, progress } = levelProgressFromXp(totalXp)

  return (
    <div className="glass-panel-strong flex items-center gap-4 rounded-2xl p-4 shadow-[0_16px_40px_-20px_var(--violet-glow)]">
      <div className="relative shrink-0">
        <div
          className="animate-float flex size-16 items-center justify-center rounded-full text-3xl"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--violet) 25%, var(--card)), var(--card))",
            boxShadow: "0 0 0 2px var(--violet), 0 0 20px -2px var(--violet-glow)",
          }}
          aria-hidden="true"
        >
          {profile.avatar}
        </div>
        <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-mark-x font-mono text-[0.65rem] font-bold text-background shadow-[0_0_10px_var(--mark-x-glow)]">
          {level}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{profile.name}</p>
        <Progress
          value={progress * 100}
          className="shimmer-sweep mt-2 h-2 [&>[data-slot=progress-indicator]]:bg-violet"
        />
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {xpIntoLevel} / {xpForNextLevel} XP to level {level + 1}
        </p>
      </div>

      <Button size="sm" variant="outline" className="tactile shrink-0" onClick={onEdit}>
        Edit
      </Button>
    </div>
  )
}
