import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useGame } from "@/features/game/context"
import {
  BOARD_SIZE_PRESETS,
  WIN_LENGTH_PRESETS,
  type AiDifficulty,
  type OpponentType,
} from "@/features/game/types"

export function GameSetupPanel() {
  const { state, dispatch } = useGame()
  const { config } = state

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>New match</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-muted-foreground">Board size</span>
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
          <span className="text-sm font-medium text-muted-foreground">Win condition</span>
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
          <span className="text-sm font-medium text-muted-foreground">Opponent</span>
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
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">AI difficulty</span>
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
          </div>
        )}

        <Button className="mt-2 w-full" onClick={() => dispatch({ type: "START_MATCH" })}>
          Start match
        </Button>
      </CardContent>
    </Card>
  )
}
