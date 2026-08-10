import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NetworkProvider, useBitcoinNetwork } from './network.context';

function NetworkProbe() {
  const { network, setNetwork } = useBitcoinNetwork();
  return (
    <div>
      <span data-testid="network">{network}</span>
      <button type="button" onClick={() => setNetwork('testnet')}>Use testnet</button>
    </div>
  );
}

beforeEach(() => window.localStorage.clear());
afterEach(cleanup);

describe('NetworkProvider', () => {
  it('persists the selected network across remounts', () => {
    const first = render(<NetworkProvider><NetworkProbe /></NetworkProvider>);
    expect(screen.getByTestId('network').textContent).toBe('mainnet');
    fireEvent.click(screen.getByRole('button', { name: 'Use testnet' }));
    expect(screen.getByTestId('network').textContent).toBe('testnet');
    first.unmount();

    render(<NetworkProvider><NetworkProbe /></NetworkProvider>);
    expect(screen.getByTestId('network').textContent).toBe('testnet');
  });
});
