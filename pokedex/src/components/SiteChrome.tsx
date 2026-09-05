import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="grain relative min-h-dvh bg-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-11 border-r border-ink/10 bg-linear-to-b from-[#7a2a24] via-[#5c1f1c] to-[#3d1614] md:block"
      >
        <div className="mt-16 flex flex-col gap-10 px-[15px]">
          {Array.from({ length: 7 }, (_, hole) => (
            <span
              key={hole}
              className="block size-3 rounded-full bg-paper/35 shadow-[inset_0_1px_1px_rgba(0,0,0,0.35)]"
            />
          ))}
        </div>
      </div>

      <div className="md:pl-11">
        <header className="border-b border-ink/12">
          <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-5 py-6 sm:px-8">
            <Link to="/" className="no-underline">
              <p className="font-mono text-[0.68rem] tracking-[0.22em] text-stamp uppercase">
                National specimen index
              </p>
              <h1 className="mt-1 font-display text-[2.1rem] leading-none font-semibold tracking-tight text-ink sm:text-4xl">
                Field Ledger
              </h1>
            </Link>
            <p className="max-w-xs text-right font-mono text-[0.68rem] leading-relaxed tracking-[0.04em] text-ink-soft">
              Volume open · Source PokeAPI
              <br />
              Names and elements only
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">{children}</main>

        <footer className="mx-auto max-w-6xl border-t border-ink/12 px-5 py-6 sm:px-8">
          <p className="font-mono text-[0.68rem] leading-relaxed tracking-[0.04em] text-ink-soft">
            Drawn from{' '}
            <a
              href="https://pokeapi.co/"
              className="text-ink underline decoration-rule underline-offset-3 hover:decoration-stamp"
            >
              PokeAPI
            </a>
            . Not affiliated with Nintendo or The Pokémon Company. Filed for
            study, not for catching.
          </p>
        </footer>
      </div>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="max-w-lg">
      <p className="font-mono text-[0.7rem] tracking-[0.16em] text-stamp uppercase">
        Folio missing
      </p>
      <h2 className="mt-3 font-display text-4xl font-medium tracking-tight italic">
        Nothing is filed under that path.
      </h2>
      <p className="mt-4 text-ink-soft">
        The page may have been mis-copied. Return to the ledger and look the
        creature up by name.
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
