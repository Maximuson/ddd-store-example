# Web (Multi-Framework)

The browser layer is split into framework-specific apps plus a shared vertical-slice package.

## Structure

```
apps/web/
├── shared/     @ddd-store/web-shared — pages, logic, spec per feature slice
├── react/      @ddd-store/web-react   — React 19 (port 5173)
├── vue/        @ddd-store/web-vue      — Vue 3.5.40 (port 5174)
├── angular/    @ddd-store/web-angular  — Angular 22 (port 5175)
└── astro/      @ddd-store/web-astro    — Astro 7 (port 4321)
```

## Shared slices (`@ddd-store/web-shared`)

Each feature folder (`shell`, `auth`, `catalog`, `users`, `admin`) contains:

- `pages/` — route metadata (`path`, `title`, `guard`)
- `logic/` — framework-agnostic xstate store logic
- `spec/` — TypeScript prop contracts
- `index.ts` — barrel exports

Global styles: `styles/theme.css` (Tailwind v4 `@theme` tokens).

Requires **Node.js** 24.18.0 (see repo `.nvmrc`).

## Dev commands

```bash
npm run dev:web:react
npm run dev:web:vue
npm run dev:web:angular
npm run dev:web:astro
npm run dev:web             # alias for React
```

## Architecture (Variant B)

- **Shared:** CSS tokens, page metadata, store logic, prop specs
- **Per framework:** UI components and hooks under `src/features/<slice>/`
- **Packages:** `packages/*` remain framework-free (domain + application + infrastructure)
