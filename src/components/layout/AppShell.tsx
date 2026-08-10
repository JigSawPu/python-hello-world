import { NavLink, Outlet } from 'react-router-dom';
import type { BitcoinNetwork } from '../../domain/network';
import { NETWORKS } from '../../features/network/network.config';
import { useBitcoinNetwork } from '../../features/network/network.context';
import { useChainTip } from '../../hooks/useChainTip';
import { SearchForm } from '../search/SearchForm';

const navItems = [
  ['/', 'Home'],
  ['/blocks', 'Blocks'],
  ['/mempool', 'Mempool'],
  ['/fees', 'Fees'],
] as const;

export function AppShell() {
  const { network, setNetwork } = useBitcoinNetwork();
  const tip = useChainTip();
  const apiState = tip.isPending ? 'Connecting' : tip.isError ? 'Offline' : 'Connected';

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-row">
          <NavLink className="brand" to="/" aria-label="Bitcoin Explorer home">
            <span className="brand-mark" aria-hidden="true">₿</span>
            <span>Bitcoin Explorer</span>
          </NavLink>
          <label className="network-control">
            <span className="sr-only">Bitcoin network</span>
            <select
              aria-label="Bitcoin network"
              value={network}
              onChange={(event) => setNetwork(event.currentTarget.value as BitcoinNetwork)}
            >
              {Object.values(NETWORKS).map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </label>
        </div>

        <SearchForm />

        <nav className="main-nav" aria-label="Primary navigation">
          {navItems.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }: { isActive: boolean }) => isActive ? 'active' : undefined}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="content-shell">
        <section className={`api-banner api-${apiState.toLowerCase()}`} aria-live="polite">
          <span>API: {apiState}</span>
          <span>Network: {NETWORKS[network].label}</span>
          <span>{tip.data !== undefined ? `Tip: ${tip.data.toLocaleString()}` : 'Tip: —'}</span>
          {tip.isError && <button type="button" onClick={() => void tip.refetch()}>Retry</button>}
        </section>
        <Outlet />
      </main>

      <footer className="app-footer">
        <span>Search + Esplora provider foundation</span>
        <span>Network: {NETWORKS[network].label}</span>
        <span>API: {apiState}</span>
      </footer>
    </div>
  );
}
