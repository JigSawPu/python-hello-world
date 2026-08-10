import { useQuery } from '@tanstack/react-query';
import { useBitcoinNetwork } from '../features/network/network.context';
import { useBitcoinProvider } from './useBitcoinProvider';

export function useChainTip() {
  const { network } = useBitcoinNetwork();
  const provider = useBitcoinProvider();

  return useQuery({
    queryKey: ['bitcoin', network, 'tip'],
    queryFn: () => provider.getTipHeight(),
    refetchInterval: 30_000,
  });
}
