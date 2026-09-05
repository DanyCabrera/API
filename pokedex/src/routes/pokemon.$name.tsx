import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { StatMeter } from '../components/StatMeter'
import { TypeBadge } from '../components/TypeBadge'
import {
  catalogNumber,
  cleanFlavorText,
  displayName,
  kilosFromHectograms,
  metersFromDecimetres,
} from '../lib/format'
import {
  artworkUrl,
  getPokemon,
  getSpecies,
  spriteUrl,
} from '../lib/pokeapi'

export const Route = createFileRoute('/pokemon/$name')({
  component: PokemonPage,
})

function PokemonPage() {
  const { name } = Route.useParams()
  const [artFailed, setArtFailed] = useState(false)

  const pokemonQuery = useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => getPokemon(name),
  })

  const speciesName = pokemonQuery.data?.species.name
  const speciesQuery = useQuery({
    queryKey: ['species', speciesName],
    queryFn: () => getSpecies(speciesName!),
    enabled: Boolean(speciesName),
  })

  if (pokemonQuery.isLoading) {
    return (
      <div>
        <p className="font-mono text-[0.7rem] tracking-[0.16em] text-stamp uppercase">
          Opening dossier…
        </p>
        <div className="mt-6 grid gap-8 lg:grid-cols-[20rem_1fr]">
          <div className="aspect-square bg-plate" />
          <div className="space-y-4">
            <div className="h-10 w-2/3 bg-rule/70" />
            <div className="h-4 w-1/3 bg-rule/50" />
            <div className="h-24 bg-rule/30" />
          </div>
        </div>
      </div>
    )
  }

  if (pokemonQuery.isError || !pokemonQuery.data) {
    return (
      <div className="max-w-lg">
        <p className="font-mono text-[0.7rem] tracking-[0.16em] text-stamp uppercase">
          Not on file
        </p>
        <h2 className="mt-3 font-display text-4xl font-medium tracking-tight italic">
          No dossier for “{displayName(name)}”.
        </h2>
        <p className="mt-4 text-ink-soft">
          That name is not in the cabinet. It may be misspelled, or it may be a
          form the archive keeps under another slip.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block font-mono text-sm tracking-[0.08em] text-moss uppercase underline decoration-rule underline-offset-4"
        >
          Return to the ledger
        </Link>
      </div>
    )
  }

  const pokemon = pokemonQuery.data
  const species = speciesQuery.data
  const genus =
    species?.genera.find((entry) => entry.language.name === 'en')?.genus ??
    'Unclassified species'
  const note = species?.flavor_text_entries.find(
    (entry) => entry.language.name === 'en',
  )?.flavor_text
  const portrait = artFailed
    ? spriteUrl(pokemon.id)
    : (pokemon.sprites.other?.['official-artwork']?.front_default ??
      artworkUrl(pokemon.id))
  const rank = species?.is_legendary
    ? 'Legendary'
    : species?.is_mythical
      ? 'Mythical'
      : null

  return (
    <article>
      <Link
        to="/"
        className="font-mono text-[0.72rem] tracking-[0.12em] text-ink-soft uppercase no-underline hover:text-ink"
      >
        ← Return to the ledger
      </Link>

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-[minmax(16rem,20rem)_1fr]">
        <figure className="border border-ink/15 bg-paper p-4">
          <div className="relative flex aspect-square items-center justify-center bg-plate">
            <div className="absolute inset-5 rounded-full border border-ink/8" />
            <img
              src={portrait}
              alt={displayName(pokemon.name)}
              onError={() => setArtFailed(true)}
              className="relative z-10 max-h-[82%] max-w-[82%] object-contain"
            />
          </div>
          <figcaption className="mt-3 flex items-center justify-between font-mono text-[0.68rem] tracking-[0.12em] text-ink-soft uppercase">
            <span>Plate {catalogNumber(pokemon.id)}</span>
            <span>Official artwork</span>
          </figcaption>
        </figure>

        <div>
          <p className="font-mono text-[0.72rem] tracking-[0.18em] text-stamp">
            № {catalogNumber(pokemon.id)}
            {rank ? ` · ${rank}` : ''}
          </p>
          <h2 className="mt-2 font-display text-5xl leading-none font-medium tracking-tight italic sm:text-6xl">
            {displayName(pokemon.name)}
          </h2>
          <p className="mt-3 text-lg text-ink-soft">{genus}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {pokemon.types.map((slot) => (
              <TypeBadge key={slot.type.name} name={slot.type.name} />
            ))}
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-ink/12 py-5 sm:grid-cols-4">
            <Metric label="Height" value={metersFromDecimetres(pokemon.height)} />
            <Metric label="Weight" value={kilosFromHectograms(pokemon.weight)} />
            <Metric
              label="Habitat"
              value={species?.habitat ? displayName(species.habitat.name) : '—'}
            />
            <Metric
              label="Base exp."
              value={pokemon.base_experience?.toString() ?? '—'}
            />
          </dl>

          {note ? (
            <blockquote className="mt-6 max-w-xl font-display text-xl leading-snug text-ink italic">
              “{cleanFlavorText(note)}”
              <cite className="mt-3 block font-mono text-[0.68rem] tracking-[0.12em] text-ink-soft not-italic uppercase">
                Field note ·{' '}
                {species.flavor_text_entries
                  .find((entry) => entry.language.name === 'en')
                  ?.version.name.replaceAll('-', ' ')}
              </cite>
            </blockquote>
          ) : null}
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <h3 className="font-mono text-[0.72rem] tracking-[0.16em] text-ink-soft uppercase">
            Observed measures
          </h3>
          <div className="mt-5 space-y-4">
            {pokemon.stats.map((entry) => (
              <StatMeter
                key={entry.stat.name}
                name={entry.stat.name}
                value={entry.base_stat}
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-mono text-[0.72rem] tracking-[0.16em] text-ink-soft uppercase">
            Recorded abilities
          </h3>
          <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/12">
            {pokemon.abilities.map((entry) => (
              <li
                key={entry.ability.name}
                className="flex items-baseline justify-between gap-4 py-3"
              >
                <span className="font-display text-xl italic">
                  {displayName(entry.ability.name)}
                </span>
                <span className="font-mono text-[0.68rem] tracking-[0.12em] text-ink-soft uppercase">
                  {entry.is_hidden ? 'Hidden' : 'Common'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[0.66rem] tracking-[0.14em] text-ink-soft uppercase">
        {label}
      </dt>
      <dd className="mt-1 font-display text-2xl tracking-tight">{value}</dd>
    </div>
  )
}
