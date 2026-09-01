import { Grid3x3, Swords, Target, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useGame } from "@/features/game/context"
import {
  BOARD_SIZE_PRESETS,
  WIN_LENGTH_PRESETS,
  type AiDifficulty,
  type OpponentType,
} from "@/features/game/types"

function SectionLabel({ icon: Icon, children }: { icon: typeof Grid3x3; children: string }) {
  return (
    <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
      <Icon className="size-4" />
      {children}
    </span>
  )
}

export function GameSetupPanel() {
  const { state, dispatch } = useGame()
  const { config } = state

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-panel-strong mx-auto w-full max-w-md rounded-3xl p-6 shadow-[0_24px_70px_-30px_rgb(0_0_0/80%)]"
    >
      <h2 className="mb-5 font-heading text-xl font-bold tracking-tight">New match</h2>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <SectionLabel icon={Grid3x3}>Board size</SectionLabel>
          <ToggleGroup
            type="single"
            variant="outline"
            value={String(config.boardSize)}
            onValueChange={(value) => {
              if (!value) return
              dispatch({ type: "CONFIGURE", config: { boardSize: Number(value) } })
            }}
            className="flex-wrap"
          >
            {BOARD_SIZE_PRESETS.map((size) => (
              <ToggleGroupItem key={size} value={String(size)} aria-label={`${size} by ${size}`}>
                {size}×{size}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="flex flex-col gap-2">
          <SectionLabel icon={Target}>Win condition</SectionLabel>
          <ToggleGroup
            type="single"
            variant="outline"
            value={String(config.winLength)}
            onValueChange={(value) => {
              if (!value) return
              dispatch({ type: "CONFIGURE", config: { winLength: Number(value) } })
            }}
          >
            {WIN_LENGTH_PRESETS.map((length) => (
              <ToggleGroupItem
                key={length}
                value={String(length)}
                disabled={length > config.boardSize}
                aria-label={`${length} in a row`}
              >
                {length} in a row
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <SectionLabel icon={Swords}>Opponent</SectionLabel>
          <ToggleGroup
            type="single"
            variant="outline"
            value={config.opponent}
            onValueChange={(value) => {
              if (!value) return
              dispatch({ type: "CONFIGURE", config: { opponent: value as OpponentType } })
            }}
          >
            <ToggleGroupItem value="local">Pass &amp; play</ToggleGroupItem>
            <ToggleGroupItem value="ai">vs AI</ToggleGroupItem>
          </ToggleGroup>
        </div>

        {config.opponent === "ai" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col gap-2 overflow-hidden"
          >
            <SectionLabel icon={Zap}>AI difficulty</SectionLabel>
            <ToggleGroup
              type="single"
              variant="outline"
              value={config.aiDifficulty}
              onValueChange={(value) => {
                if (!value) return
                dispatch({ type: "CONFIGURE", config: { aiDifficulty: value as AiDifficulty } })
              }}
            >
              <ToggleGroupItem value="easy">Easy</ToggleGroupItem>
              <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
              <ToggleGroupItem value="hard">Hard</ToggleGroupItem>
            </ToggleGroup>
          </motion.div>
        )}

        <Button
          className="cta-gradient tactile mt-2 w-full border-0 font-semibold"
          onClick={() => dispatch({ type: "START_MATCH" })}
        >
          Start match
        </Button>
      </div>
    </motion.div>
  )
}
