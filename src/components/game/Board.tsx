import { useMemo } from "react"
import { useGame } from "@/features/game/context"
import { indexToRowCol } from "@/features/game/winDetection"
import { Cell } from "./Cell"

interface BoardVisualScale {
  gap: string
  markText: string
}

function boardVisualScale(boardSize: number): BoardVisualScale {
  if (boardSize <= 4) return { gap: "gap-2", markText: "text-4xl sm:text-5xl" }
  if (boardSize <= 6) return { gap: "gap-1.5", markText: "text-2xl sm:text-3xl" }
  if (boardSize <= 8) return { gap: "gap-1", markText: "text-lg sm:text-2xl" }
  return { gap: "gap-0.5", markText: "text-base sm:text-lg" }
}

interface BoardProps {
  /** True while it's a human's turn to act on this board (false mid-AI-turn or when the match isn't live). */
  interactive: boolean
}

export function Board({ interactive }: BoardProps) {
  const { state, dispatch } = useGame()
  const { boardSize } = state.config

  const winningSet = useMemo(() => new Set(state.winner?.line ?? []), [state.winner])
  const scale = useMemo(() => boardVisualScale(boardSize), [boardSize])

  function handleSelect(index: number) {
    if (!interactive) return
    if (state.status !== "playing") return
    if (state.board[index] !== null) return
    dispatch({ type: "PLACE_MARK", index })
  }

  return (
    <div
      role="grid"
      aria-label={`Tic-tac-toe board, ${boardSize} by ${boardSize}`}
      className={`mx-auto grid aspect-square w-full max-w-[min(94vw,32rem)] touch-manipulation ${scale.gap}`}
      style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}
    >
      {state.board.map((value, index) => {
        const [row, col] = indexToRowCol(index, boardSize)
        return (
          <Cell
            key={index}
            value={value}
            isWinning={winningSet.has(index)}
            disabled={!interactive || state.status !== "playing" || value !== null}
            markTextClass={scale.markText}
            label={
              value
                ? `Row ${row + 1}, column ${col + 1}: ${value}`
                : `Row ${row + 1}, column ${col + 1}: empty`
            }
            onSelect={() => handleSelect(index)}
          />
        )
      })}
    </div>
  )
}
