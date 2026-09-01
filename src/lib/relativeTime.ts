const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

const DIVISIONS: ReadonlyArray<readonly [Intl.RelativeTimeFormatUnit, number]> = [
  ["second", 60],
  ["minute", 60],
  ["hour", 24],
  ["day", 7],
  ["week", 4.34524],
  ["month", 12],
  ["year", Infinity],
]

/** e.g. "5 minutes ago", "yesterday" — cascades through Intl.RelativeTimeFormat's units. */
export function formatRelativeTime(iso: string): string {
  let duration = (new Date(iso).getTime() - Date.now()) / 1000

  for (const [unit, amount] of DIVISIONS) {
    if (Math.abs(duration) < amount) return rtf.format(Math.round(duration), unit)
    duration /= amount
  }
  return rtf.format(Math.round(duration), "year")
}
