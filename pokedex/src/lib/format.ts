export function displayName(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function catalogNumber(id: number): string {
  return String(id).padStart(4, '0')
}

export function metersFromDecimetres(height: number): string {
  return `${(height / 10).toFixed(1)} m`
}

export function kilosFromHectograms(weight: number): string {
  return `${(weight / 10).toFixed(1)} kg`
}

export function cleanFlavorText(text: string): string {
  return text.replace(/[\f\n\r\t]+/g, ' ').replace(/\s+/g, ' ').trim()
}

export const STAT_LABELS: Record<string, string> = {
  hp: 'Vitality',
  attack: 'Strike',
  defense: 'Hide',
  'special-attack': 'Focus',
  'special-defense': 'Resolve',
  speed: 'Stride',
}
