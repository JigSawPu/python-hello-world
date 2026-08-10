export interface BitcoinDataProvider {
  getTipHeight(signal?: AbortSignal): Promise<number>;
  getTipHash(signal?: AbortSignal): Promise<string>;
  getBlockHashByHeight(height: number, signal?: AbortSignal): Promise<string>;
  transactionExists(txid: string, signal?: AbortSignal): Promise<boolean>;
  blockExists(hash: string, signal?: AbortSignal): Promise<boolean>;
  addressExists(address: string, signal?: AbortSignal): Promise<boolean>;
}
