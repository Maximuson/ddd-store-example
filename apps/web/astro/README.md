# Astro Static Site (`@ddd-store/web-astro`)

Static Astro 7 app that pre-renders the full catalog at build time. No Vue islands or client-side data fetching — product HTML is generated from mock catalog data when you run `astro build`.

## Build and run

From the repo root:

```bash
npm install
npm run dev:web:astro                    # dev server on port 4321
npm run build -w @ddd-store/web-astro   # static output → apps/web/astro/dist/
npm run preview -w @ddd-store/web-astro # serve dist locally
```

Requires **Node.js** 24.18.0 (see repo `.nvmrc`).

## Data source

Catalog data comes from a single file:

`packages/catalog/src/infrastructure/mocks/MockProductRepository.ts` → `mockProductsData`

At build time, pages call `GetProductsUseCase` / `GetProductByIdUseCase` with `MockProductRepository`. Product detail routes are generated via `getStaticPaths()` from the same data.

The Astro app does **not** use:

- The API database (`apps/api/prisma/seed.ts`)
- `VITE_USE_MOCK` or `VITE_API_URL` from `.env.example`

## When catalog items change

| Action | What to edit | Then |
|--------|-------------|------|
| **Add a product** | Add a new entry to `mockProductsData` in `MockProductRepository.ts` | Rebuild Astro — a new `/product/<id>/index.html` page is generated automatically |
| **Change product details** (title, price, image, description, etc.) | Edit the matching entry in `mockProductsData` | Rebuild Astro — catalog and product pages reflect the update |
| **Remove a product** | Remove the entry from `mockProductsData` | Rebuild Astro — that product page is no longer generated |

No database migrations, seeding, or route configuration is required. After editing mock data, run:

```bash
npm run build -w @ddd-store/web-astro
```

### Example: adding a product

1. Open `packages/catalog/src/infrastructure/mocks/MockProductRepository.ts`
2. Add a new `Product.create({ ... })` entry with a unique `id` (e.g. `p13`)
3. Rebuild — the new product appears on `/` and `/catalog`, and `/product/p13/` is created

### Important notes

- Mock data is **independent** of the API seed and other web apps. Changing `MockProductRepository.ts` does not update React/Vue/Angular in API mode or the mobile app unless you update those sources separately.
- `getStaticPaths` derives product URLs from `mockProductsData` — new products get pages automatically.
- Built output is plain static HTML in `dist/` suitable for any static host (no server or JavaScript required for catalog browsing).

## Project structure

```
apps/web/astro/
├── src/
│   ├── components/
│   │   ├── CatalogGrid.astro    # product grid
│   │   ├── ProductCard.astro    # single product card
│   │   └── ProductDetail.astro  # product detail view
│   ├── layouts/
│   │   └── BaseLayout.astro     # shared nav + page shell
│   └── pages/
│       ├── index.astro          # home + catalog preview
│       ├── catalog.astro        # full catalog
│       ├── login.astro          # static placeholder
│       └── product/[id].astro   # product detail (SSG)
├── astro.config.mjs
└── package.json
```

## Expected build output

- 15 static pages: `/`, `/catalog`, `/login`, `/product/p1` … `/product/p12`
- Full product titles and prices in HTML (no "Loading..." placeholders)
- No Vue runtime or island JavaScript bundles
