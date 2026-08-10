import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { PlaceholderPage } from '../pages/PlaceholderPage';

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<PlaceholderPage title="Bitcoin Explorer" description="Milestone 1 foundation is online. Search and live Bitcoin data arrive in the next deliveries." />} />
        <Route path="/blocks" element={<PlaceholderPage title="Blocks" description="Recent block browsing will be implemented in Milestone 2." />} />
        <Route path="/block/:blockId" element={<PlaceholderPage title="Block" description="Block detail routing is ready." />} />
        <Route path="/tx/:txid" element={<PlaceholderPage title="Transaction" description="Transaction detail routing is ready." />} />
        <Route path="/address/:address" element={<PlaceholderPage title="Address" description="Address detail routing is ready." />} />
        <Route path="/mempool" element={<PlaceholderPage title="Mempool" description="Mempool intelligence will be added after the explorer foundation." />} />
        <Route path="/fees" element={<PlaceholderPage title="Fees" description="Fee estimates will be connected through the Bitcoin data provider." />} />
        <Route path="/404" element={<PlaceholderPage title="Not found" description="The requested explorer page could not be found." />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
