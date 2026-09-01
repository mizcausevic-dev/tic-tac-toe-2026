import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Gamepad2, UserRound } from "lucide-react"
import { Board } from "@/components/game/Board"
import { GameSetupPanel } from "@/components/game/GameSetupPanel"
import { GameStatusBar } from "@/components/game/GameStatusBar"
import { PlayerScoreCards } from "@/components/game/PlayerScoreCards"
import { ProfilePanel } from "@/components/profile/ProfilePanel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGame } from "@/features/game/context"
import { HUMAN_MARK } from "@/features/game/types"
import { isAiThinking, useAiOpponent } from "@/features/game/useAiOpponent"
import { useLevelUpToast } from "@/features/profile/useLevelUpToast"
import { useMatchRecorder } from "@/features/useMatchRecorder"
import { cn } from "@/lib/utils"

type ViewTab = "play" | "profile"

const NAV_ITEMS: Array<{ value: ViewTab; label: string; icon: typeof Gamepad2 }> = [
  { value: "play", label: "Play", icon: Gamepad2 },
  { value: "profile", label: "Profile", icon: UserRound },
]

export function AppShell() {
  useMatchRecorder()
  useAiOpponent()
  useLevelUpToast()
  const { state } = useGame()
  const [activeTab, setActiveTab] = useState<ViewTab>("play")

  const aiThinking = isAiThinking(state)
  const interactive = state.config.opponent !== "ai" || state.currentPlayer === HUMAN_MARK

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-6 px-4 pt-8 pb-28 sm:pb-12">
      <header className="text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight drop-shadow-[0_0_24px_var(--violet-glow)] sm:text-4xl">
          Tic-Tac-Toe <span className="text-mark-x">2026</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Any board. Any win length. Pass &amp; play or take on the AI.
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ViewTab)} className="gap-4">
        <TabsList className="mx-auto hidden sm:flex">
          {NAV_ITEMS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="gap-1.5">
              <Icon className="size-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="play">
          <AnimatePresence mode="wait">
            {state.status === "setup" ? (
              <GameSetupPanel key="setup" />
            ) : (
              <motion.div
                key="board"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col gap-4"
              >
                <PlayerScoreCards />
                <p className="text-center font-mono text-xs text-muted-foreground">
                  {state.config.boardSize}×{state.config.boardSize} · {state.config.winLength} in a
                  row
                  {aiThinking && <span className="text-mark-o"> · AI thinking…</span>}
                </p>
                <Board interactive={interactive} />
                <GameStatusBar />
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <ProfilePanel />
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Mobile bottom nav, echoing the reference's app-shell pattern; desktop keeps the top tabs. */}
      <nav className="glass-panel-strong fixed inset-x-4 bottom-4 z-50 flex justify-around rounded-2xl p-1.5 shadow-[0_16px_40px_-16px_rgb(0_0_0/80%)] sm:hidden">
        {NAV_ITEMS.map(({ value, label, icon: Icon }) => {
          const active = activeTab === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => setActiveTab(value)}
              aria-current={active}
              className={cn(
                "tactile flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-xs font-medium transition-colors",
                active ? "bg-primary/15 text-mark-x" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
              {label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
