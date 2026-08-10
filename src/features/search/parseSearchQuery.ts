import type { BitcoinNetwork } from '../../domain/network';
import { isValidAddressForNetwork, looksLikeBitcoinAddress } from '../../lib/bitcoin/addressValidation';
import type { SearchCandidate } from './search.types';

const hashPattern = /^[0-9a-f]{64}$/i;
const heightPattern = /^\d+$/;

export function parseSearchQuery(rawQuery: string, network: BitcoinNetwork): SearchCandidate {
  const query = rawQuery.trim();

  if (!query) {
    return { type: 'invalid', reason: 'Enter a block height, transaction ID, block hash, or Bitcoin address.' };
  }

  if (heightPattern.test(query)) {
    const height = Number(query);
    if (!Number.isSafeInteger(height)) {
      return { type: 'invalid', reason: 'The block height is too large.' };
    }
    return { type: 'block-height', height };
  }

  if (hashPattern.test(query)) {
    return { type: 'hash', hash: query.toLowerCase() };
  }

  if (isValidAddressForNetwork(query, network)) {
    return { type: 'address', address: query };
  }

  if (looksLikeBitcoinAddress(query)) {
    return {
      type: 'invalid',
      reason: 'This address is invalid or does not belong to the selected Bitcoin network.',
    };
  }

  return { type: 'invalid', reason: 'This search value is not a recognized Bitcoin block, hash, or address.' };
}
