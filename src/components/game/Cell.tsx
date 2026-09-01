import type { CellValue } from "@/features/game/types"
import { cn } from "@/lib/utils"

interface CellProps {
  value: CellValue
  onSelect: () => void
  isWinning: boolean
  disabled: boolean
  markTextClass: string
  label: string
}

export function Cell({ value, onSelect, isWinning, disabled, markTextClass, label }: CellProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "relative flex aspect-square min-w-0 items-center justify-center rounded-lg border font-bold transition-colors duration-150",
        "border-border bg-card disabled:cursor-not-allowed",
        !value && !disabled && "cursor-pointer hover:bg-accent active:bg-accent",
        isWinning && "animate-win-pulse border-primary bg-primary/10",
        markTextClass
      )}
    >
      {value && (
        <span
          key={value}
          className={cn("animate-mark-pop", value === "X" ? "text-mark-x" : "text-mark-o")}
        >
          {value}
        </span>
      )}
    </button>
  )
}
