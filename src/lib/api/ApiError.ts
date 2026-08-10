export type ApiErrorKind = 'http' | 'timeout' | 'network' | 'invalid-response';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly kind: ApiErrorKind = 'http',
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
