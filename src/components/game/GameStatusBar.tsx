import { motion } from "framer-motion"
import { Trophy, Handshake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGame } from "@/features/game/context"

export function GameStatusBar() {
  const { state, dispatch } = useGame()
  const { config, status, winner, moveCount } = state

  if (status === "won" && winner) {
    const isHumanWin = winner.mark === "X"
    return (
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="glass-panel-strong flex flex-col items-center gap-3 rounded-2xl px-5 py-4 text-center shadow-[0_0_30px_-10px_var(--glow-color)] sm:flex-row sm:justify-between sm:text-left"
        style={{
          ["--glow-color" as string]: winner.mark === "X" ? "var(--mark-x)" : "var(--mark-o)",
        }}
      >
        <div className="flex items-center gap-3">
          <Trophy
            className="size-7 shrink-0"
            style={{ color: winner.mark === "X" ? "var(--mark-x)" : "var(--mark-o)" }}
          />
          <p className="text-lg font-semibold">
            <span className={winner.mark === "X" ? "text-mark-x" : "text-mark-o"}>
              {winner.mark}
            </span>{" "}
            wins in {moveCount} move{moveCount === 1 ? "" : "s"}
            {config.opponent === "ai" && (
              <span className="ml-1 block text-sm font-normal text-muted-foreground sm:inline">
                {isHumanWin ? "— nice reads." : "— the bot got there first."}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="tactile" onClick={() => dispatch({ type: "RESET_MATCH" })}>
            Rematch
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="tactile"
            onClick={() => dispatch({ type: "NEW_SETUP" })}
          >
            New setup
          </Button>
        </div>
      </motion.div>
    )
  }

  if (status === "draw") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="glass-panel-strong flex flex-col items-center gap-3 rounded-2xl px-5 py-4 text-center sm:flex-row sm:justify-between sm:text-left"
      >
        <div className="flex items-center gap-3">
          <Handshake className="size-7 shrink-0 text-secondary" />
          <p className="text-lg font-semibold">Draw — the board filled up.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="tactile" onClick={() => dispatch({ type: "RESET_MATCH" })}>
            Rematch
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="tactile"
            onClick={() => dispatch({ type: "NEW_SETUP" })}
          >
            New setup
          </Button>
        </div>
      </motion.div>
    )
  }

  return null
}
