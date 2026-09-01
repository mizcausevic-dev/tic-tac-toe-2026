import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useProfile } from "@/features/profile/context"
import { AVATAR_CHOICES, type Profile } from "@/features/profile/types"
import { cn } from "@/lib/utils"

interface ProfileEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileEditDialog({ open, onOpenChange }: ProfileEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Your name and avatar are stored only on this device.
          </DialogDescription>
        </DialogHeader>
        {/* Radix unmounts DialogContent's children while closed, so this form
            remounts fresh (with up-to-date initial values) every time it opens —
            no effect-based state sync needed. */}
        {open && <ProfileEditForm onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function ProfileEditForm({ onDone }: { onDone: () => void }) {
  const { state, dispatch } = useProfile()
  const [name, setName] = useState(state.profile.name)
  const [avatar, setAvatar] = useState<Profile["avatar"]>(state.profile.avatar)

  function handleSave() {
    dispatch({ type: "UPDATE_PROFILE", name, avatar })
    onDone()
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="profile-name">Name</Label>
          <Input
            id="profile-name"
            value={name}
            maxLength={24}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Avatar</Label>
          <div className="flex flex-wrap gap-2">
            {AVATAR_CHOICES.map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => setAvatar(choice)}
                aria-pressed={avatar === choice}
                aria-label={`Avatar ${choice}`}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full border text-xl transition-colors",
                  avatar === choice
                    ? "border-primary bg-primary/15"
                    : "border-border bg-card hover:bg-accent"
                )}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!name.trim()}>
          Save
        </Button>
      </DialogFooter>
    </>
  )
}
