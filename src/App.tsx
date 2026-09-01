import { AppShell } from "@/components/layout/AppShell"
import { Toaster } from "@/components/ui/sonner"
import { GameProvider } from "@/features/game/context"
import { ProfileProvider } from "@/features/profile/context"

function App() {
  return (
    <ProfileProvider>
      <GameProvider>
        <AppShell />
        <Toaster />
      </GameProvider>
    </ProfileProvider>
  )
}

export default App
