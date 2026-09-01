import { Button } from "@/components/ui/button"
import { useGame } from "@/features/game/context"
import { cn } from "@/lib/utils"

export function GameStatusBar({ aiThinking = false }: { aiThinking?: boolean }) {
  const { state, dispatch } = useGame()
  const { config } = state

  const boardLabel = `${config.boardSize}×${config.boardSize} · ${config.winLength} in a row`

  if (state.status === "won" && state.winner) {
    const isHumanWin = state.winner.mark === "X"
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-lg font-semibold">
          <span className={state.winner.mark === "X" ? "text-mark-x" : "text-mark-o"}>
            {state.winner.mark}
          </span>{" "}
          wins in {state.moveCount} move{state.moveCount === 1 ? "" : "s"}
          {config.opponent === "ai" && (
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              {isHumanWin ? "— nice reads." : "— the bot got there first."}
            </span>
          )}
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => dispatch({ type: "RESET_MATCH" })}>
            Rematch
          </Button>
          <Button size="sm" variant="outline" onClick={() => dispatch({ type: "NEW_SETUP" })}>
            New setup
          </Button>
        </div>
      </div>
    )
  }

  if (state.status === "draw") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-lg font-semibold">Draw — the board filled up.</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => dispatch({ type: "RESET_MATCH" })}>
            Rematch
          </Button>
          <Button size="sm" variant="outline" onClick={() => dispatch({ type: "NEW_SETUP" })}>
            New setup
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
      <p className="font-medium">
        <span className={cn(state.currentPlayer === "X" ? "text-mark-x" : "text-mark-o")}>
          {state.currentPlayer}
        </span>
        {"'s turn"}
        {aiThinking && <span className="ml-2 text-sm text-muted-foreground">thinking…</span>}
      </p>
      <p className="text-sm text-muted-foreground">{boardLabel}</p>
    </div>
  )
}
