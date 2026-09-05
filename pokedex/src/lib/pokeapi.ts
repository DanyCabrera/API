const API = 'https://pokeapi.co/api/v2'
const ARTWORK =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'
const SPRITE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

export type NamedResource = {
  name: string
  url: string
}

export type PokemonListResponse = {
  count: number
  results: NamedResource[]
}

export type TypeListResponse = {
  results: NamedResource[]
}

export type TypeDetailResponse = {
  name: string
  pokemon: Array<{ pokemon: NamedResource; slot: number }>
}

export type PokemonStat = {
  base_stat: number
  stat: NamedResource
}

export type PokemonTypeSlot = {
  slot: number
  type: NamedResource
}

export type PokemonAbility = {
  is_hidden: boolean
  ability: NamedResource
}

export type PokemonDetail = {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  types: PokemonTypeSlot[]
  stats: PokemonStat[]
  abilities: PokemonAbility[]
  species: NamedResource
  sprites: {
    front_default: string | null
    other?: {
      'official-artwork'?: {
        front_default: string | null
      }
    }
  }
}

export type PokemonSpecies = {
  id: number
  name: string
  genera: Array<{ genus: string; language: NamedResource }>
  flavor_text_entries: Array<{
    flavor_text: string
    language: NamedResource
    version: NamedResource
  }>
  color: NamedResource
  habitat: NamedResource | null
  is_legendary: boolean
  is_mythical: boolean
}

const SKIPPED_TYPES = new Set(['unknown', 'shadow', 'stellar'])

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Archive request failed (${response.status})`)
  }
  return response.json() as Promise<T>
}

export function idFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean)
  return Number(parts[parts.length - 1])
}

export function artworkUrl(id: number): string {
  return `${ARTWORK}/${id}.png`
}

export function spriteUrl(id: number): string {
  return `${SPRITE}/${id}.png`
}

export function getPokemonIndex() {
  return fetchJson<PokemonListResponse>(`${API}/pokemon?limit=2000`)
}

export async function getTypes() {
  const data = await fetchJson<TypeListResponse>(`${API}/type`)
  return data.results.filter((type) => !SKIPPED_TYPES.has(type.name))
}

export async function getPokemonByType(type: string) {
  const data = await fetchJson<TypeDetailResponse>(`${API}/type/${type}`)
  return data.pokemon.map((entry) => entry.pokemon)
}

export function getPokemon(name: string) {
  return fetchJson<PokemonDetail>(`${API}/pokemon/${name.toLowerCase()}`)
}

export function getSpecies(nameOrId: string | number) {
  return fetchJson<PokemonSpecies>(`${API}/pokemon-species/${nameOrId}`)
}
