import { address as bitcoinAddress, networks } from 'bitcoinjs-lib';
import type { BitcoinNetwork } from '../../domain/network';

const addressLikePattern = /^(?:bc1|tb1|[123mn])[a-zA-Z0-9]+$/i;

export function looksLikeBitcoinAddress(value: string): boolean {
  return addressLikePattern.test(value);
}

export function isValidAddressForNetwork(value: string, network: BitcoinNetwork): boolean {
  const bitcoinNetwork = network === 'mainnet' ? networks.bitcoin : networks.testnet;

  try {
    bitcoinAddress.toOutputScript(value, bitcoinNetwork);
    return true;
  } catch {
    return false;
  }
}
