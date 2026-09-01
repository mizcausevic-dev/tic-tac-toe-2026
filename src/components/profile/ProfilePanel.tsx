import { useState } from "react"
import { MatchHistoryList } from "./MatchHistoryList"
import { ProfileEditDialog } from "./ProfileEditDialog"
import { ProfileHeader } from "./ProfileHeader"
import { StatsGrid } from "./StatsGrid"

export function ProfilePanel() {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <ProfileHeader onEdit={() => setEditOpen(true)} />
      <StatsGrid />
      <MatchHistoryList />
      <ProfileEditDialog open={editOpen} onOpenChange={setEditOpen} />
    </div>
  )
}
