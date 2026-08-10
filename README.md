# Bitcoin Explorer

Static-first Bitcoin blockchain explorer foundation built with Vite, TypeScript, Preact, React Router, TanStack Query, Zod, bitcoinjs-lib, Vitest, Testing Library, Playwright, and vite-plugin-pwa.

## Milestone 1 deliveries

- Delivery 1: repository/deployment foundation — complete
- Delivery 2: network + Esplora provider infrastructure — complete
- Delivery 3: search parsing/resolution + reusable feedback — complete
- Delivery 4: unit/component/browser smoke validation — current

## Validation

GitHub CI performs:

```text
TypeScript
ESLint
Vitest unit/component tests
Production Vite build
Playwright Chromium smoke tests
```

The test suite covers block-height/hash/address classification, address network validation, provider resolution, persisted network selection, search navigation, homepage loading, and direct application routes.

## Commands

```bash
npm install
npm run typecheck
npm run lint
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
```

## API configuration

```env
VITE_MAINNET_API_URL=https://blockstream.info/api
VITE_TESTNET_API_URL=https://blockstream.info/testnet/api
VITE_SIGNET_API_URL=https://blockstream.info/signet/api
```

The API URLs are public browser configuration. No backend secret is required.

## Static deployment

Build command: `npm install --no-audit --no-fund && npm run build`

Publish directory: `dist`

For BrowserRouter, the static host must rewrite `/*` to `/index.html`. The repository's `render.yaml` contains that rule. See `docs/render-spa.md` for the manual Render equivalent when a site was not created from the Blueprint.
