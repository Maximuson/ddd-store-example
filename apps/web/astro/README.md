# Astro Static Site (`@ddd-store/web-astro`)

Static Astro 7 app that pre-renders the full catalog at build time. No Vue islands or client-side data fetching — product HTML is generated when you run `astro build`.

## Build and run

From the repo root:

```bash
npm install
cp apps/web/astro/.env.example apps/web/astro/.env
npm run dev:web:astro                    # dev server on port 4321
npm run build -w @ddd-store/web-astro   # static output → apps/web/astro/dist/
npm run preview -w @ddd-store/web-astro # serve dist locally
```

Requires **Node.js** 24.18.0 (see repo `.nvmrc`).

## Data source (mock vs API)

Repository selection is controlled by environment variables in `apps/web/astro/.env` (same pattern as the React/Vue/Angular apps):

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_USE_MOCK` | `"true"` | When `"true"`, uses `MockProductRepository`. Set to `"false"` to fetch from the API at build time. |
| `VITE_API_URL` | `http://localhost:3000` | API base URL when `VITE_USE_MOCK=false`. |

The choice is made in [`src/lib/productRepository.ts`](src/lib/productRepository.ts) and used by `index.astro`, `catalog.astro`, and `product/[id].astro`.

### Mock mode (default)

```bash
# apps/web/astro/.env
VITE_USE_MOCK="true"
```

Data comes from `packages/catalog/src/infrastructure/mocks/MockProductRepository.ts` → `mockProductsData`.

No API server required.

### API mode

```bash
# apps/web/astro/.env
VITE_USE_MOCK="false"
VITE_API_URL="http://localhost:3000"
```

**The API must be running and reachable during `astro build` and `astro dev`.** Product pages are generated from `GET /products` and `GET /products/:id`.

```bash
# Terminal 1 — start API with seeded database
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev:api

# Terminal 2 — build Astro against live API
npm run build -w @ddd-store/web-astro
```

## When catalog items change

### Mock mode

| Action | What to edit | Then |
|--------|-------------|------|
| **Add a product** | Add entry to `mockProductsData` in `MockProductRepository.ts` | Rebuild Astro |
| **Change product details** | Edit the matching entry in `mockProductsData` | Rebuild Astro |
| **Remove a product** | Remove entry from `mockProductsData` | Rebuild Astro |

### API mode

| Action | What to do | Then |
|--------|-----------|------|
| **Add / change / remove products** | Update via Admin UI, API, or re-run `npm run db:seed` | Rebuild Astro (API must be running) |

After any catalog change:

```bash
npm run build -w @ddd-store/web-astro
```

`getStaticPaths()` in `product/[id].astro` fetches the current product list at build time, so new products get pages automatically and removed products are dropped.

### Example: adding a product (mock mode)

1. Open `packages/catalog/src/infrastructure/mocks/MockProductRepository.ts`
2. Add a new `Product.create({ ... })` entry with a unique `id` (e.g. `p13`)
3. Rebuild — the new product appears on `/` and `/catalog`, and `/product/p13/` is created

## Project structure

```
apps/web/astro/
├── src/
│   ├── lib/
│   │   └── productRepository.ts # mock vs API repository factory
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
├── .env.example
├── astro.config.mjs
└── package.json
```

## Expected build output

- Static pages: `/`, `/catalog`, `/login`, plus one `/product/<id>/` per product
- Full product titles and prices in HTML (no "Loading..." placeholders)
- No Vue runtime or island JavaScript bundles
