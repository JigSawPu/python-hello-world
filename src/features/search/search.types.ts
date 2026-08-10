export type SearchCandidate =
  | { type: 'block-height'; height: number }
  | { type: 'hash'; hash: string }
  | { type: 'address'; address: string }
  | { type: 'invalid'; reason: string };

export type ResolvedSearch =
  | { type: 'block'; value: string }
  | { type: 'transaction'; value: string }
  | { type: 'address'; value: string }
  | { type: 'not-found'; message: string };
