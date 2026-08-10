import type { NetworkConfig } from '../../domain/network';
import type { BitcoinDataProvider } from './BitcoinDataProvider';
import { EsploraProvider } from './esplora/EsploraProvider';

export function createBitcoinProvider(config: NetworkConfig): BitcoinDataProvider {
  return new EsploraProvider(config.apiBaseUrl);
}
