import type { BitcoinNetwork, NetworkConfig } from '../../domain/network';

export const NETWORKS: Record<BitcoinNetwork, NetworkConfig> = {
  mainnet: {
    id: 'mainnet',
    label: 'Mainnet',
    apiBaseUrl: import.meta.env.VITE_MAINNET_API_URL || 'https://blockstream.info/api',
  },
  testnet: {
    id: 'testnet',
    label: 'Testnet',
    apiBaseUrl: import.meta.env.VITE_TESTNET_API_URL || 'https://blockstream.info/testnet/api',
  },
  signet: {
    id: 'signet',
    label: 'Signet',
    apiBaseUrl: import.meta.env.VITE_SIGNET_API_URL || 'https://blockstream.info/signet/api',
  },
};

export const DEFAULT_NETWORK: BitcoinNetwork = 'mainnet';
