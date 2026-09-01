import type { CSSProperties } from "react"
import { motion } from "framer-motion"
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
  const color = value === "X" ? "var(--mark-x)" : value === "O" ? "var(--mark-o)" : undefined

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "tactile relative flex aspect-square min-w-0 items-center justify-center overflow-hidden rounded-xl border font-bold",
        "border-border bg-gradient-to-b from-white/[0.03] to-transparent disabled:cursor-not-allowed",
        !value && "bg-card/70",
        !value && !disabled && "cursor-pointer hover:border-white/20 hover:bg-accent",
        isWinning && "animate-win-pulse border-primary",
        markTextClass
      )}
      style={
        value
          ? ({
              background: `radial-gradient(circle at 50% 35%, color-mix(in oklab, ${color} 20%, transparent), color-mix(in oklab, ${color} 6%, var(--card)) 75%)`,
              borderColor: `color-mix(in oklab, ${color} 35%, var(--border))`,
            } as CSSProperties)
          : undefined
      }
    >
      {value && (
        <motion.span
          key={value}
          initial={{ scale: 0.3, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 18 }}
          className="drop-shadow-[0_0_10px_var(--glow)]"
          style={{
            color,
            ["--glow" as string]: value === "X" ? "var(--mark-x-glow)" : "var(--mark-o-glow)",
          }}
        >
          {value}
        </motion.span>
      )}
    </button>
  )
}
