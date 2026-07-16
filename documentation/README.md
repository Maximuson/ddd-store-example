# Documentation

Docusaurus site for the DDD Store Example architecture docs.

## Local development

From the repository root:

```bash
npm install
npm run dev:docs
```

The dev server runs at http://localhost:3000/ddd-store-example/

## Build

```bash
npm run build:docs
```

Output is written to `documentation/build/`.

## Deployment

GitHub Pages deployment is handled by `.github/workflows/deploy-documentation.yml` on push to `main`.
