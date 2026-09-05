import { STAT_LABELS } from '../lib/format'

export function StatMeter({ name, value }: { name: string; value: number }) {
  const pct = Math.min(100, (value / 180) * 100)

  return (
    <div className="grid grid-cols-[7.5rem_1fr_2.4rem] items-center gap-3">
      <span className="font-mono text-[0.68rem] tracking-[0.12em] text-ink-soft uppercase">
        {STAT_LABELS[name] ?? name}
      </span>
      <div className="h-[3px] bg-rule/80">
        <div className="h-full bg-ink" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-right font-mono text-sm">{value}</span>
    </div>
  )
}
