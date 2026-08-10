export type BitcoinNetwork = 'mainnet' | 'testnet' | 'signet';

export interface NetworkConfig {
  id: BitcoinNetwork;
  label: string;
  apiBaseUrl: string;
}
