import { describe, expect, it } from 'vitest';
import { parseSearchQuery } from './parseSearchQuery';

const GENESIS_ADDRESS = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';

 describe('parseSearchQuery', () => {
  it('parses a block height after trimming whitespace', () => {
    expect(parseSearchQuery(' 840000 ', 'mainnet')).toEqual({ type: 'block-height', height: 840000 });
  });

  it('parses a 64-character hexadecimal hash', () => {
    const hash = 'A'.repeat(64);
    expect(parseSearchQuery(hash, 'mainnet')).toEqual({ type: 'hash', hash: hash.toLowerCase() });
  });

  it('validates a mainnet address checksum and network', () => {
    expect(parseSearchQuery(GENESIS_ADDRESS, 'mainnet')).toEqual({
      type: 'address',
      address: GENESIS_ADDRESS,
    });
  });

  it('rejects a mainnet address when testnet is selected', () => {
    expect(parseSearchQuery(GENESIS_ADDRESS, 'testnet').type).toBe('invalid');
  });

  it('rejects unrecognized input locally', () => {
    expect(parseSearchQuery('not bitcoin data', 'mainnet').type).toBe('invalid');
  });
});
