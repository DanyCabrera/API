import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { PokemonCard, PokemonCardSkeleton } from '../components/PokemonCard'
import { SearchField } from '../components/SearchField'
import { TypeSelect } from '../components/TypeSelect'
import { displayName } from '../lib/format'
import {
  getPokemonByType,
  getPokemonIndex,
  getTypes,
  idFromUrl,
} from '../lib/pokeapi'

const PAGE_SIZE = 24
const SURVEY_CAP = 151

type CatalogSearch = {
  q?: string
  type?: string
  page?: number
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => {
    const pageValue = Number(search.page)
    return {
      q: typeof search.q === 'string' && search.q.trim() ? search.q : undefined,
      type:
        typeof search.type === 'string' && search.type.trim()
          ? search.type
          : undefined,
      page: Number.isFinite(pageValue) && pageValue > 1 ? pageValue : undefined,
    }
  },
  component: CatalogPage,
})

function CatalogPage() {
  const { q, type, page } = Route.useSearch()
  const navigate = useNavigate({ from: '/' })
  const currentPage = page ?? 1

  const indexQuery = useQuery({
    queryKey: ['pokemon-index'],
    queryFn: getPokemonIndex,
    staleTime: 1000 * 60 * 60,
  })

  const typesQuery = useQuery({
    queryKey: ['pokemon-types'],
    queryFn: getTypes,
    staleTime: Infinity,
  })

  const typeQuery = useQuery({
    queryKey: ['pokemon-type', type],
    queryFn: () => getPokemonByType(type!),
    enabled: Boolean(type),
    staleTime: 1000 * 60 * 30,
  })

  const entries = useMemo(() => {
    const source = type
      ? (typeQuery.data ?? [])
      : (indexQuery.data?.results ?? [])
    const needle = q?.trim().toLowerCase()
    const filtered = needle
      ? source.filter((pokemon) => pokemon.name.includes(needle))
      : source

    if (!type && !needle) {
      return filtered.filter((pokemon) => idFromUrl(pokemon.url) <= SURVEY_CAP)
    }

    return filtered
  }, [indexQuery.data?.results, q, type, typeQuery.data])

  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const pageItems = entries.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const exactMatch = q
    ? entries.find((pokemon) => pokemon.name === q.trim().toLowerCase())
    : undefined

  const isLoading = type ? typeQuery.isLoading : indexQuery.isLoading
  const isError = type ? typeQuery.isError : indexQuery.isError

  const setSearch = (next: CatalogSearch) => {
    void navigate({
      search: {
        q: next.q,
        type: next.type,
        page: next.page,
      },
    })
  }

  const heading = !q && !type
    ? 'Volume I — first survey'
    : type && q
      ? `${displayName(type)} · “${q}”`
      : type
        ? `${displayName(type)} element`
        : `Name contains “${q}”`

  return (
    <div>
      <section className="grid gap-8 border-b border-ink/12 pb-8 lg:grid-cols-[minmax(0,1.4fr)_16rem] lg:items-end">
        <SearchField
          value={q ?? ''}
          onChange={(next) =>
            setSearch({ q: next.trim() || undefined, type, page: undefined })
          }
          onSubmit={(next) => {
            const match = (type ? typeQuery.data : indexQuery.data?.results)?.find(
              (pokemon) => pokemon.name === next.trim().toLowerCase(),
            )
            if (match) {
              void navigate({
                to: '/pokemon/$name',
                params: { name: match.name },
              })
            }
          }}
        />
        <label className="block">
          <span className="mb-2 block font-mono text-[0.68rem] tracking-[0.16em] text-ink-soft uppercase">
            Filter by element
          </span>
          <TypeSelect
            value={type}
            types={typesQuery.data ?? []}
            onChange={(next) =>
              setSearch({ q, type: next, page: undefined })
            }
          />
        </label>
      </section>

      <section className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[0.68rem] tracking-[0.16em] text-stamp uppercase">
            {isLoading ? 'Pulling slips…' : `${entries.length} on file`}
          </p>
          <h2 className="mt-1 font-display text-3xl font-medium tracking-tight italic">
            {heading}
          </h2>
        </div>
        {!q && !type ? (
          <p className="max-w-sm text-sm text-ink-soft">
            The open volume lists the first 151 filed species. Search a name or
            pick an element to open the rest of the cabinet.
          </p>
        ) : null}
      </section>

      {exactMatch ? (
        <p className="mt-5 border border-dashed border-moss/40 bg-moss/6 px-4 py-3 text-sm">
          Exact match on file.{' '}
          <button
            type="button"
            onClick={() =>
              void navigate({
                to: '/pokemon/$name',
                params: { name: exactMatch.name },
              })
            }
            className="font-medium text-moss underline decoration-moss/40 underline-offset-3"
          >
            Open the {displayName(exactMatch.name)} dossier
          </button>
        </p>
      ) : null}

      {isError ? (
        <p className="mt-10 max-w-md border border-stamp/30 bg-[#b42318]/6 px-4 py-4 text-sm">
          The archive did not answer. Check the connection and try the drawer
          again.
        </p>
      ) : null}

      {isLoading ? (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <PokemonCardSkeleton key={index} index={index} />
          ))}
        </div>
      ) : null}

      {!isLoading && !isError && entries.length === 0 ? (
        <div className="ruled mt-10 max-w-lg py-8">
          <h3 className="font-display text-2xl italic">No specimen on file.</h3>
          <p className="mt-3 text-ink-soft">
            Nothing matches that name
            {type ? ` within the ${displayName(type)} drawer` : ''}. Check the
            spelling, or clear the element filter.
          </p>
        </div>
      ) : null}

      {!isLoading && pageItems.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {pageItems.map((pokemon, index) => (
            <PokemonCard key={pokemon.name} pokemon={pokemon} index={index} />
          ))}
        </div>
      ) : null}

      {totalPages > 1 && !isLoading ? (
        <nav className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ink/12 pt-5">
          <p className="font-mono text-[0.72rem] tracking-[0.12em] text-ink-soft uppercase">
            Folio {safePage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <PageButton
              disabled={safePage <= 1}
              onClick={() =>
                setSearch({
                  q,
                  type,
                  page: safePage > 2 ? safePage - 1 : undefined,
                })
              }
            >
              Previous
            </PageButton>
            <PageButton
              disabled={safePage >= totalPages}
              onClick={() =>
                setSearch({ q, type, page: safePage + 1 })
              }
            >
              Next
            </PageButton>
          </div>
        </nav>
      ) : null}
    </div>
  )
}

function PageButton({
  children,
  disabled,
  onClick,
}: {
  children: string
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="border border-ink/20 px-3 py-1.5 font-mono text-[0.72rem] tracking-[0.1em] uppercase disabled:cursor-not-allowed disabled:opacity-35 hover:enabled:border-ink hover:enabled:bg-night hover:enabled:text-paper"
    >
      {children}
    </button>
  )
}
