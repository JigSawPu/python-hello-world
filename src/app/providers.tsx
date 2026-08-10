import type { ComponentChildren } from 'preact';
import { QueryClientProvider } from '@tanstack/react-query';
import { NetworkProvider } from '../features/network/network.context';
import { queryClient } from './queryClient';

export function AppProviders({ children }: { children: ComponentChildren }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>{children}</NetworkProvider>
    </QueryClientProvider>
  );
}
