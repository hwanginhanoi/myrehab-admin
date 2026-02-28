import type { TooltipProps } from 'recharts'
import type {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent'

type ChartTooltipProps = TooltipProps<ValueType, NameType> & {
  valueFormatter?: (value: number, name: string) => string
}

export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  // For single-entry charts (e.g. PieChart), the label duplicates the entry
  // name — skip the header in that case.
  const showHeader =
    label != null &&
    label !== '' &&
    !(payload.length === 1 && payload[0].name === label)

  return (
    <div className="min-w-[150px] overflow-hidden rounded-xl border bg-background text-xs shadow-xl">
      {showHeader && (
        <div className="border-b bg-muted/40 px-3 py-2">
          <p className="font-semibold text-foreground">{label}</p>
        </div>
      )}
      <div className="space-y-1.5 px-3 py-2.5">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-6">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="truncate text-muted-foreground">
                {entry.name}
              </span>
            </div>
            <span className="font-semibold tabular-nums text-foreground">
              {valueFormatter
                ? valueFormatter(Number(entry.value), String(entry.name))
                : String(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
