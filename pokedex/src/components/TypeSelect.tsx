import * as Select from '@radix-ui/react-select'
import { displayName } from '../lib/format'
import type { NamedResource } from '../lib/pokeapi'
import { typePigment } from '../lib/types'

type TypeSelectProps = {
  value?: string
  types: NamedResource[]
  onChange: (next?: string) => void
}

export function TypeSelect({ value, types, onChange }: TypeSelectProps) {
  return (
    <Select.Root
      value={value ?? 'all'}
      onValueChange={(next) => onChange(next === 'all' ? undefined : next)}
    >
      <Select.Trigger
        aria-label="Filter by element"
        className="flex h-12 w-full items-center justify-between border border-ink/20 bg-paper px-3 text-left outline-none hover:border-ink/45 focus-visible:border-moss data-[placeholder]:text-ink-soft"
      >
        <Select.Value placeholder="Any element" />
        <Select.Icon className="font-mono text-sm text-ink-soft">▾</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="z-50 max-h-72 w-[var(--radix-select-trigger-width)] overflow-hidden border border-ink/25 bg-paper shadow-[4px_6px_0_rgba(26,22,18,0.08)]"
        >
          <Select.Viewport className="p-1">
            <TypeOption value="all" label="Any element" />
            {types.map((type) => (
              <TypeOption
                key={type.name}
                value={type.name}
                label={displayName(type.name)}
                swatch={typePigment(type.name).bg}
              />
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

function TypeOption({
  value,
  label,
  swatch,
}: {
  value: string
  label: string
  swatch?: string
}) {
  return (
    <Select.Item
      value={value}
      className="flex cursor-pointer items-center gap-2 px-2.5 py-2 text-sm outline-none data-highlighted:bg-paper-deep data-disabled:opacity-40"
    >
      {swatch ? (
        <span
          className="size-2.5 shrink-0 rounded-full border border-ink/20"
          style={{ backgroundColor: swatch }}
        />
      ) : (
        <span className="size-2.5 shrink-0 border border-dashed border-ink/30" />
      )}
      <Select.ItemText>{label}</Select.ItemText>
    </Select.Item>
  )
}
