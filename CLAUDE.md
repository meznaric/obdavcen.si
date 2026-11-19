# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Slovenian tax calculator web app (obdavcen.si) that compares tax efficiency across business entity types: Normirani s. p., s. p., and d. o. o. (with multiple salary strategies). Built for digital remote workers evaluating the most tax-efficient structure for their income.

The app is primarily in **Slovenian language** — all UI text, blog posts, and variable names related to tax domain use Slovenian terminology.

## Commands

- `yarn dev` — start dev server
- `yarn build` — production build (React Router + Vite)
- `yarn start` — serve production build
- `yarn lint` — ESLint
- `yarn typecheck` — route type generation + TypeScript check (`react-router typegen && tsc`)

## Architecture

**Stack:** React Router 8 (framework mode, Vite 8), React 19, TypeScript, Tailwind CSS 4 + DaisyUI 5 (configured in `app/tailwind.css`, no `tailwind.config`), XState Store for state management, visx for charts, MDX for blog posts.

**Path alias:** `~/` maps to `./app/`

### File Structure (from CONVENTIONS.md)

```
app/
├─ constants/          # Year-specific tax rates, brackets, thresholds
│  ├─ types.ts         # SharedInputs, YearSettings, PrispevkiSettings, IncomeTaxBrackets
│  └─ 2025/            # 2025 tax year constants
├─ ui/
│  ├─ common/          # Reusable atoms (Button, Card, Input, Slider, Tabs, etc.)
│  └─ pages/           # Page components with co-located hooks and utils
│     ├─ IndexPage/    # Main calculator page with GraphArea (visx charts)
│     └─ Blogs/        # Blog post shared components (CurrencyOutput, SharedInputs)
├─ routes/             # File-based routes (flat routes, see app/routes.ts)
│  ├─ _index.tsx       # Main calculator page
│  ├─ izplacilo.tsx    # Blog layout (parent route for MDX blog posts)
│  └─ izplacilo.*.mdx  # Blog posts (normirani-sp, sp, doo)
├─ utils/
│  ├─ taxCalculator/   # Core tax calculation functions per entity type
│  ├─ prispevki.ts     # Social security contribution calculations
│  ├─ dohodnina.ts     # Income tax (dohodnina) bracket calculations
│  ├─ store.ts         # XState store (revenue, expenses, salaryGross1)
│  └─ taxModes.ts      # Registry mapping entity types to calculators and display config
└─ hooks/              # Shared hooks
```

### Tax Calculation Flow

1. **Inputs** (`SharedInputs`): revenue, expenses, salaryGross1, optional lanskiPrispevki
2. **Year settings** (`YearSettings` in `constants/`): tax brackets, contribution rates, relief amounts — all year-specific
3. **Calculators** (`utils/taxCalculator/`): one per entity type — `normiraniSp.ts`, `sp.ts`, `doo.ts`, `dooMinimalnaPlaca.ts`, `dooNajvecjaPlaca.ts`, `dooPoljubnaPlaca.ts`
4. **Shared tax logic**: `prispevki.ts` (zavarovalna osnova, contribution rates), `dohodnina.ts` (progressive brackets, tax relief)
5. **Mode registry** (`taxModes.ts`): maps each entity type to its calculator, color, and display name — used by the graph and comparison views

### Blog Posts

Written in MDX format under `app/routes/izplacilo.*.mdx`. Use the template at `app/routes/izplacilo.template.mdx`. Blog posts import tax constants directly and use components like `CurrencyOutput` and `SharedInputs` for interactive calculations. See `DIRECTIONS.md` for blog writing guidelines (structure, SEO, Slovenian language requirements).

## Conventions

- Use DaisyUI component classes for styling, `twMerge` from tailwind-merge for class merging
- Reusable UI atoms go in `app/ui/common/`; page-specific components, hooks, and utils are co-located in their page folder
- Extract hooks and state management early; break components into small, readable pieces
- Tax domain terms remain in Slovenian (prispevki, dohodnina, zavarovalna osnova, dobicek, etc.)
- Blog content must be in correct Slovenian with proper diacritics (šumniki)
