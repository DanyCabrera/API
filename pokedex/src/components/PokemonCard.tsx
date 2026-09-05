import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { catalogNumber, displayName } from '../lib/format'
import { artworkUrl, idFromUrl, spriteUrl, type NamedResource } from '../lib/pokeapi'

export function PokemonCard({
  pokemon,
  index,
}: {
  pokemon: NamedResource
  index: number
}) {
  const id = idFromUrl(pokemon.url)
  const [src, setSrc] = useState(artworkUrl(id))

  return (
    <Link
      to="/pokemon/$name"
      params={{ name: pokemon.name }}
      className="slip-in group block border border-ink/15 bg-paper p-3 no-underline transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-ink/40 hover:shadow-[5px_7px_0_rgba(26,22,18,0.07)]"
      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
    >
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="font-mono text-[0.7rem] tracking-[0.14em] text-stamp">
          № {catalogNumber(id)}
        </span>
        <span className="font-mono text-[0.62rem] tracking-[0.12em] text-ink-soft uppercase">
          Dossier
        </span>
      </div>
      <div className="relative mb-3 flex aspect-square items-center justify-center bg-plate">
        <div className="absolute inset-4 rounded-full border border-ink/8" />
        <img
          src={src}
          alt=""
          onError={() => setSrc(spriteUrl(id))}
          className="relative z-10 max-h-[78%] max-w-[78%] object-contain"
        />
      </div>
      <h2 className="font-display text-[1.35rem] leading-none font-medium tracking-tight text-ink italic">
        {displayName(pokemon.name)}
      </h2>
    </Link>
  )
}

export function PokemonCardSkeleton({ index }: { index: number }) {
  return (
    <div
      className="border border-ink/10 bg-paper p-3"
      style={{ opacity: 1 - index * 0.04 }}
    >
      <div className="mb-3 h-3 w-16 bg-rule/70" />
      <div className="mb-3 aspect-square bg-plate" />
      <div className="h-5 w-2/3 bg-rule/80" />
    </div>
  )
}
