# Bitcoin Explorer

Static-first Bitcoin blockchain explorer built with Vite, TypeScript, Preact, React Router, TanStack Query, Zod, CSS, Vitest, and vite-plugin-pwa.

## Milestone 1 status

### Delivery 1 — complete
- repository-ready Vite/Preact/TypeScript foundation
- responsive shell and placeholder routes
- GitHub Actions CI and Render deployment config
- PWA foundation

### Delivery 2 — current
- mainnet, testnet, and signet configuration
- persisted network selector
- BitcoinDataProvider abstraction
- Esplora provider implementation
- request timeout and normalized API errors
- Zod response validation
- TanStack Query defaults and network-scoped chain-tip query
- visible API connection state and current tip height

## Commands

```bash
npm install
npm run dev
npm run check
npm run build
```

## Public API configuration

```env
VITE_MAINNET_API_URL=https://blockstream.info/api
VITE_TESTNET_API_URL=https://blockstream.info/testnet/api
VITE_SIGNET_API_URL=https://blockstream.info/signet/api
```

These values are public browser endpoints, not secrets.

## Deployment

Render build command: `npm install --no-audit --no-fund && npm run build`

Publish directory: `dist`

`render.yaml` includes the required SPA rewrite from `/*` to `/index.html`.
