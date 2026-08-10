import { useMemo } from 'preact/hooks';
import { useBitcoinNetwork } from '../features/network/network.context';
import { createBitcoinProvider } from '../services/bitcoin/providerFactory';

export function useBitcoinProvider() {
  const { config } = useBitcoinNetwork();
  return useMemo(() => createBitcoinProvider(config), [config.apiBaseUrl]);
}
