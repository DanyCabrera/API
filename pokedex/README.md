# Field Ledger

A small Pokédex that reads [PokeAPI](https://pokeapi.co/). Look a creature up by name, or open a drawer by element.

## Stack

- React 19
- TanStack Router (file-based routes)
- TanStack Query
- Tailwind CSS 4
- Radix UI Select

TanStack Start is not used. This app is a client-side catalog over a public API, so Vite plus Router is enough.

## Commands

```bash
cd pokedex
npm install
npm run dev
```

The catalog runs at [http://localhost:5173](http://localhost:5173).

```bash
npm run build
npm run preview
```

## Routes

- `/` — search and type filter (`?q=`, `?type=`, `?page=`)
- `/pokemon/$name` — specimen dossier
