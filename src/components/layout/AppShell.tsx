import { Board } from "@/components/game/Board"
import { GameSetupPanel } from "@/components/game/GameSetupPanel"
import { GameStatusBar } from "@/components/game/GameStatusBar"
import { ProfilePanel } from "@/components/profile/ProfilePanel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGame } from "@/features/game/context"
import { HUMAN_MARK } from "@/features/game/types"
import { isAiThinking, useAiOpponent } from "@/features/game/useAiOpponent"
import { useLevelUpToast } from "@/features/profile/useLevelUpToast"
import { useMatchRecorder } from "@/features/useMatchRecorder"

export function AppShell() {
  useMatchRecorder()
  useAiOpponent()
  useLevelUpToast()
  const { state } = useGame()

  const aiThinking = isAiThinking(state)
  const interactive = state.config.opponent !== "ai" || state.currentPlayer === HUMAN_MARK

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:py-12">
      <header className="text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Tic-Tac-Toe <span className="text-mark-x">2026</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Any board. Any win length. Pass &amp; play or take on the AI.
        </p>
      </header>

      <Tabs defaultValue="play" className="gap-4">
        <TabsList className="mx-auto">
          <TabsTrigger value="play">Play</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="play" className="flex flex-col gap-4">
          {state.status === "setup" ? (
            <GameSetupPanel />
          ) : (
            <>
              <GameStatusBar aiThinking={aiThinking} />
              <Board interactive={interactive} />
            </>
          )}
        </TabsContent>

        <TabsContent value="profile">
          <ProfilePanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
