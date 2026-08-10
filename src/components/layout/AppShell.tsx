import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  ['/', 'Home'],
  ['/blocks', 'Blocks'],
  ['/mempool', 'Mempool'],
  ['/fees', 'Fees'],
] as const;

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-row">
          <NavLink className="brand" to="/" aria-label="Bitcoin Explorer home">
            <span className="brand-mark" aria-hidden="true">₿</span>
            <span>Bitcoin Explorer</span>
          </NavLink>
          <div className="network-pill" aria-label="Selected network">Mainnet</div>
        </div>

        <form className="search-shell" onSubmit={(event) => event.preventDefault()} aria-label="Explorer search">
          <input
            aria-label="Search blocks, transactions, or addresses"
            placeholder="Search block, transaction, or address"
            disabled
          />
          <button type="submit" disabled>Search</button>
        </form>

        <nav className="main-nav" aria-label="Primary navigation">
          {navItems.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'active' : undefined}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="content-shell">
        <Outlet />
      </main>

      <footer className="app-footer">
        <span>Static-first explorer foundation</span>
        <span>Network: Mainnet</span>
        <span>Data provider: pending Delivery 2</span>
      </footer>
    </div>
  );
}
