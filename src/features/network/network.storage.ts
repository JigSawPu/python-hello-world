import type { BitcoinNetwork } from '../../domain/network';
import { DEFAULT_NETWORK } from './network.config';

const STORAGE_KEY = 'bitcoin-explorer.network';
const NETWORKS: BitcoinNetwork[] = ['mainnet', 'testnet', 'signet'];

export function readStoredNetwork(): BitcoinNetwork {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as BitcoinNetwork | null;
    return stored && NETWORKS.includes(stored) ? stored : DEFAULT_NETWORK;
  } catch {
    return DEFAULT_NETWORK;
  }
}

export function writeStoredNetwork(network: BitcoinNetwork): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, network);
  } catch {
    // Persistence is best-effort; browsing still works if storage is unavailable.
  }
}
