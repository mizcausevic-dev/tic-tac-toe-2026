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
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
      <div
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent text-3xl"
        aria-hidden="true"
      >
        {profile.avatar}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-semibold">{profile.name}</p>
          <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
            Lv {level}
          </span>
        </div>
        <Progress value={progress * 100} className="mt-2 h-2" />
        <p className="mt-1 text-xs text-muted-foreground">
          {xpIntoLevel} / {xpForNextLevel} XP to level {level + 1}
        </p>
      </div>
      <Button size="sm" variant="outline" onClick={onEdit}>
        Edit
      </Button>
    </div>
  )
}
