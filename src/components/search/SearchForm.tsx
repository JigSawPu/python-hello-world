import { useState } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';
import { useBitcoinNetwork } from '../../features/network/network.context';
import { parseSearchQuery } from '../../features/search/parseSearchQuery';
import { resolveSearchQuery } from '../../features/search/resolveSearchQuery';
import { ApiError } from '../../lib/api/ApiError';
import { useBitcoinProvider } from '../../hooks/useBitcoinProvider';
import { ErrorState } from '../feedback/ErrorState';
import { LoadingState } from '../feedback/LoadingState';
import { NotFoundState } from '../feedback/NotFoundState';

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 429) return 'The Bitcoin data provider is rate limiting requests. Try again shortly.';
    if (error.kind === 'timeout') return 'The Bitcoin data provider took too long to respond.';
    if (error.kind === 'network') return 'The Bitcoin data provider is unreachable from this device.';
    if (error.kind === 'invalid-response') return 'The Bitcoin data provider returned an unexpected response.';
  }
  return 'The search could not be completed. Please try again.';
}

export function SearchForm() {
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const navigate = useNavigate();
  const provider = useBitcoinProvider();
  const { network } = useBitcoinNetwork();

  const submit = async (event: Event) => {
    event.preventDefault();
    if (pending) return;

    const candidate = parseSearchQuery(query, network);
    if (candidate.type === 'invalid') {
      setFailed(false);
      setMessage(candidate.reason);
      return;
    }

    setPending(true);
    setMessage(null);
    setFailed(false);

    try {
      const result = await resolveSearchQuery(candidate, provider);
      if (result.type === 'not-found') {
        setMessage(result.message);
        return;
      }

      if (result.type === 'transaction') navigate(`/tx/${result.value}`);
      if (result.type === 'block') navigate(`/block/${result.value}`);
      if (result.type === 'address') navigate(`/address/${encodeURIComponent(result.value)}`);
      setQuery('');
    } catch (error) {
      setFailed(true);
      setMessage(errorMessage(error));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="search-area">
      <form className="search-shell" onSubmit={submit} aria-label="Explorer search">
        <input
          aria-label="Search blocks, transactions, or addresses"
          placeholder="Block height, transaction ID, block hash, or address"
          value={query}
          onInput={(event) => setQuery(event.currentTarget.value)}
          autoCapitalize="none"
          autoCorrect="off"
          spellcheck={false}
        />
        <button type="submit" disabled={pending || !query.trim()}>{pending ? 'Searching…' : 'Search'}</button>
      </form>
      {pending && <LoadingState label="Resolving Bitcoin search…" />}
      {!pending && message && (failed ? <ErrorState message={message} /> : <NotFoundState message={message} />)}
    </div>
  );
}
