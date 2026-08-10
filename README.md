# Bitcoin Explorer

Static-first Bitcoin blockchain explorer built with Vite, TypeScript, Preact, React Router, TanStack Query, Zod, CSS, Vitest, and vite-plugin-pwa.

## Milestone 1 status

Delivery 1 establishes the repository-ready application foundation:

- Vite + Preact + TypeScript
- responsive application shell
- placeholder explorer routes
- PWA manifest/service worker foundation
- ESLint, Prettier, Vitest
- GitHub Actions CI
- Render static-site Blueprint with SPA rewrite

## Commands

```bash
npm install
npm run dev
npm run check
npm run build
```

## Deployment

Render build command:

```text
npm install --no-audit --no-fund && npm run build
```

Publish directory: `dist`

The included `render.yaml` defines a catch-all rewrite from `/*` to `/index.html` so direct React Router URLs can load correctly.

## Delivery branches

- `bitcoin-explorer/delivery-1` — repository and deployment foundation
- Delivery 2 — Bitcoin provider and network infrastructure
- Delivery 3 — search foundation
- Delivery 4 — final Milestone 1 validation and testing
