import { describe, expect, it, vi } from 'vitest';
import type { BitcoinDataProvider } from '../../services/bitcoin/BitcoinDataProvider';
import { resolveSearchQuery } from './resolveSearchQuery';

function makeProvider(overrides: Partial<BitcoinDataProvider> = {}): BitcoinDataProvider {
  return {
    getTipHeight: vi.fn(async () => 900000),
    getTipHash: vi.fn(async () => 'f'.repeat(64)),
    getBlockHashByHeight: vi.fn(async () => 'b'.repeat(64)),
    transactionExists: vi.fn(async () => false),
    blockExists: vi.fn(async () => false),
    addressExists: vi.fn(async () => true),
    ...overrides,
  };
}

describe('resolveSearchQuery', () => {
  it('resolves an existing block height to its block hash', async () => {
    const result = await resolveSearchQuery({ type: 'block-height', height: 840000 }, makeProvider());
    expect(result).toEqual({ type: 'block', value: 'b'.repeat(64) });
  });

  it('rejects a height above the current chain tip', async () => {
    const result = await resolveSearchQuery({ type: 'block-height', height: 900001 }, makeProvider());
    expect(result.type).toBe('not-found');
  });

  it('prefers a transaction match for an ambiguous hash', async () => {
    const hash = 'a'.repeat(64);
    const provider = makeProvider({ transactionExists: vi.fn(async () => true) });
    expect(await resolveSearchQuery({ type: 'hash', hash }, provider)).toEqual({
      type: 'transaction',
      value: hash,
    });
  });

  it('falls back to a block match when the hash is not a transaction', async () => {
    const hash = 'c'.repeat(64);
    const provider = makeProvider({ blockExists: vi.fn(async () => true) });
    expect(await resolveSearchQuery({ type: 'hash', hash }, provider)).toEqual({
      type: 'block',
      value: hash,
    });
  });
});
