import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { NetworkProvider } from '../../features/network/network.context';
import { SearchForm } from './SearchForm';

vi.mock('../../hooks/useBitcoinProvider', () => ({
  useBitcoinProvider: () => ({
    getTipHeight: async () => 900000,
    getTipHash: async () => 'f'.repeat(64),
    getBlockHashByHeight: async () => 'b'.repeat(64),
    transactionExists: async () => false,
    blockExists: async () => false,
    addressExists: async () => true,
  }),
}));

function LocationProbe() {
  return <span data-testid="location">{useLocation().pathname}</span>;
}

beforeEach(() => window.localStorage.clear());
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('SearchForm', () => {
  it('resolves a block height and navigates to the block route', async () => {
    render(
      <NetworkProvider>
        <MemoryRouter initialEntries={['/']}>
          <SearchForm />
          <LocationProbe />
        </MemoryRouter>
      </NetworkProvider>,
    );

    fireEvent.input(screen.getByRole('textbox'), { target: { value: '840000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe(`/block/${'b'.repeat(64)}`);
    });
  });

  it('shows local feedback for invalid input', () => {
    render(
      <NetworkProvider>
        <MemoryRouter>
          <SearchForm />
        </MemoryRouter>
      </NetworkProvider>,
    );

    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'hello' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByText(/not a recognized Bitcoin block/i)).toBeTruthy();
  });
});
