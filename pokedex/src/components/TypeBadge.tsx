import { displayName } from '../lib/format'
import { typePigment } from '../lib/types'

export function TypeBadge({ name }: { name: string }) {
  const pigment = typePigment(name)

  return (
    <span
      className="type-chip inline-block"
      style={{ backgroundColor: pigment.bg, color: pigment.ink }}
    >
      {displayName(name)}
    </span>
  )
}
