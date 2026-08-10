import { z, type ZodType } from 'zod';
import { ApiError } from './ApiError';

const DEFAULT_TIMEOUT_MS = 10_000;

async function request(input: string, signal?: AbortSignal): Promise<Response> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  const forwardAbort = () => controller.abort();
  signal?.addEventListener('abort', forwardAbort, { once: true });

  try {
    const response = await fetch(input, {
      headers: { Accept: 'application/json, text/plain;q=0.9' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `Bitcoin API returned HTTP ${response.status}`);
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (controller.signal.aborted && !signal?.aborted) {
      throw new ApiError(0, 'Bitcoin API request timed out', 'timeout');
    }
    throw new ApiError(0, 'Unable to reach Bitcoin API', 'network');
  } finally {
    window.clearTimeout(timeout);
    signal?.removeEventListener('abort', forwardAbort);
  }
}

export async function getText(input: string, signal?: AbortSignal): Promise<string> {
  return (await request(input, signal)).text();
}

export async function getJson<T>(input: string, schema: ZodType<T>, signal?: AbortSignal): Promise<T> {
  const response = await request(input, signal);
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(response.status, 'Bitcoin API returned invalid JSON', 'invalid-response');
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(response.status, 'Bitcoin API response did not match the expected schema', 'invalid-response');
  }
  return parsed.data;
}

export const nonNegativeIntegerSchema = z.coerce.number().int().nonnegative();
export const hashSchema = z.string().regex(/^[0-9a-f]{64}$/i);
