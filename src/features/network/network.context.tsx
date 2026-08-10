import { createContext, type ComponentChildren } from 'preact';
import { useContext, useMemo, useState } from 'preact/hooks';
import type { BitcoinNetwork, NetworkConfig } from '../../domain/network';
import { NETWORKS } from './network.config';
import { readStoredNetwork, writeStoredNetwork } from './network.storage';

interface NetworkContextValue {
  network: BitcoinNetwork;
  config: NetworkConfig;
  setNetwork: (network: BitcoinNetwork) => void;
}

const NetworkContext = createContext<NetworkContextValue | null>(null);

export function NetworkProvider({ children }: { children: ComponentChildren }) {
  const [network, setNetworkState] = useState<BitcoinNetwork>(readStoredNetwork);

  const value = useMemo<NetworkContextValue>(() => ({
    network,
    config: NETWORKS[network],
    setNetwork: (nextNetwork) => {
      setNetworkState(nextNetwork);
      writeStoredNetwork(nextNetwork);
    },
  }), [network]);

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useBitcoinNetwork(): NetworkContextValue {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useBitcoinNetwork must be used inside NetworkProvider');
  }
  return context;
}
