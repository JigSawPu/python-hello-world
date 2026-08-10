import type { BitcoinDataProvider } from '../../services/bitcoin/BitcoinDataProvider';
import type { ResolvedSearch, SearchCandidate } from './search.types';

export async function resolveSearchQuery(
  candidate: SearchCandidate,
  provider: BitcoinDataProvider,
): Promise<ResolvedSearch> {
  if (candidate.type === 'invalid') {
    return { type: 'not-found', message: candidate.reason };
  }

  if (candidate.type === 'block-height') {
    const tip = await provider.getTipHeight();
    if (candidate.height > tip) {
      return { type: 'not-found', message: `Block ${candidate.height.toLocaleString()} is above the current chain tip.` };
    }
    const hash = await provider.getBlockHashByHeight(candidate.height);
    return { type: 'block', value: hash };
  }

  if (candidate.type === 'address') {
    const exists = await provider.addressExists(candidate.address);
    return exists
      ? { type: 'address', value: candidate.address }
      : { type: 'not-found', message: 'That Bitcoin address could not be resolved by the selected data provider.' };
  }

  if (await provider.transactionExists(candidate.hash)) {
    return { type: 'transaction', value: candidate.hash };
  }

  if (await provider.blockExists(candidate.hash)) {
    return { type: 'block', value: candidate.hash };
  }

  return { type: 'not-found', message: 'No transaction or block was found for that 64-character hash.' };
}
