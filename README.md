# Tic-Tac-Toe 2026

A tic-tac-toe game that generalizes past 3x3: any board size from 3x3 to
10x10, any win length from 3 to 5 in a row, local pass-and-play, and three
AI difficulty tiers up to a bounded minimax "hard" bot. Profiles, match
history, stats, and XP/levels persist in `localStorage`.

**Live:** https://mizcausevic-dev.github.io/tic-tac-toe-2026/

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui (Radix primitives)
- `useReducer` + Context for state — one slice for live game state, one
  independent slice for the persisted player profile
- Self-hosted variable fonts (Space Grotesk, JetBrains Mono), no external
  font requests

## How it works

- **Win detection** (`src/features/game/winDetection.ts`) scans outward from
  the just-placed cell in all 8 directions rather than checking a hardcoded
  line table, so the same function is correct for any board size and win
  length with no special-casing.
- **AI** (`src/features/game/ai.ts`) has three tiers: random, a
  win/block/center/corner heuristic, and a "hard" bot that runs minimax with
  alpha-beta pruning over a radius-bounded candidate set so search stays fast
  on boards larger than 3x3.
- **Persistence** (`src/features/profile/storage.ts`) is a single versioned
  `localStorage` key (`ttt2026:v1:profile`) with a safe fallback on
  corrupt/missing data, so future schema changes can add a migration branch
  without breaking existing saves.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint      # eslint
npm run format    # prettier --write
```

## Deployment

Pushes to `main` build and deploy automatically via GitHub Actions
(`.github/workflows/deploy.yml`) using `actions/deploy-pages` — no `gh-pages`
branch involved. `vite.config.ts`'s `base` is set to `/tic-tac-toe-2026/` to
match this repo's Pages project path.
