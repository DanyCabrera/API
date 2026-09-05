export const TYPE_PIGMENTS: Record<string, { bg: string; ink: string }> = {
  normal: { bg: '#c4b8a5', ink: '#2a241c' },
  fire: { bg: '#c45c32', ink: '#fff6ea' },
  water: { bg: '#3d6f8f', ink: '#f4f7f8' },
  electric: { bg: '#d6a31e', ink: '#2a241c' },
  grass: { bg: '#4e7a3e', ink: '#f4f7f0' },
  ice: { bg: '#7ea8b0', ink: '#1a1612' },
  fighting: { bg: '#8a3a2a', ink: '#fff6ea' },
  poison: { bg: '#6e4a7a', ink: '#f7f0f8' },
  ground: { bg: '#a07a3e', ink: '#fff8ea' },
  flying: { bg: '#6e86b0', ink: '#f4f6fa' },
  psychic: { bg: '#b45a72', ink: '#fff4f6' },
  bug: { bg: '#7a8a32', ink: '#f6f8ea' },
  rock: { bg: '#8a7450', ink: '#fff8ea' },
  ghost: { bg: '#54507a', ink: '#f4f2fa' },
  dragon: { bg: '#4a508a', ink: '#f2f3fa' },
  dark: { bg: '#4a403c', ink: '#f4efe6' },
  steel: { bg: '#6e7480', ink: '#f4f5f6' },
  fairy: { bg: '#b07088', ink: '#fff4f6' },
}

export function typePigment(name: string) {
  return TYPE_PIGMENTS[name] ?? { bg: '#c4b8a5', ink: '#2a241c' }
}
