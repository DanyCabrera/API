import { useEffect, useState } from 'react'

type SearchFieldProps = {
  value: string
  onChange: (next: string) => void
  onSubmit?: (next: string) => void
}

export function SearchField({ value, onChange, onSubmit }: SearchFieldProps) {
  const [draft, setDraft] = useState(value)
  const [syncedValue, setSyncedValue] = useState(value)

  if (value !== syncedValue) {
    setSyncedValue(value)
    setDraft(value)
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (draft !== value) {
        onChange(draft)
      }
    }, 280)
    return () => window.clearTimeout(timer)
  }, [draft, onChange, value])

  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[0.68rem] tracking-[0.16em] text-ink-soft uppercase">
        Look up a creature
      </span>
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onChange(draft)
            onSubmit?.(draft)
          }
        }}
        placeholder="pikachu, gengar, snorlax…"
        autoComplete="off"
        spellCheck={false}
        className="h-12 w-full border-0 border-b border-ink/35 bg-transparent px-0 font-display text-2xl tracking-tight text-ink outline-none placeholder:text-ink/30 focus:border-moss"
      />
    </label>
  )
}
