# Bitcoin Explorer

Static-first Bitcoin blockchain explorer built with Vite, TypeScript, Preact, React Router, TanStack Query, Zod, bitcoinjs-lib, CSS, Vitest, and vite-plugin-pwa.

## Milestone 1 delivery status

- Delivery 1: repository/deployment foundation — complete
- Delivery 2: network + Esplora provider infrastructure — complete
- Delivery 3: search parsing/resolution + feedback states — current
- Delivery 4: automated validation and Milestone 1 hardening — next

## Delivery 3 search behavior

- digits → block height, checked against the live chain tip and resolved to a block hash
- 64 hexadecimal characters → transaction first, then block hash
- Bitcoin addresses → checksum/network validation with `bitcoinjs-lib`, then provider resolution
- invalid input → local feedback without an unnecessary network call
- provider failures → normalized rate-limit, timeout, network, and invalid-response messages

Mainnet, testnet, and signet selection persists in localStorage and scopes live Esplora requests.

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

These browser endpoint URLs are public configuration, not secrets.

## Render

Build: `npm install --no-audit --no-fund && npm run build`

Publish directory: `dist`

The Blueprint file includes an SPA rewrite from `/*` to `/index.html` for direct React Router URLs.
