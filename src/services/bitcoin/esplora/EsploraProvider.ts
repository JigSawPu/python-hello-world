import { z } from 'zod';
import { ApiError } from '../../../lib/api/ApiError';
import { getJson, getText, hashSchema, nonNegativeIntegerSchema } from '../../../lib/api/http';
import type { BitcoinDataProvider } from '../BitcoinDataProvider';

const transactionStatusSchema = z.object({ confirmed: z.boolean() }).passthrough();
const blockSchema = z.object({ id: z.string() }).passthrough();
const addressSchema = z.object({ address: z.string() }).passthrough();

export class EsploraProvider implements BitcoinDataProvider {
  constructor(private readonly baseUrl: string) {}

  private url(path: string): string {
    return `${this.baseUrl.replace(/\/$/, '')}${path}`;
  }

  async getTipHeight(signal?: AbortSignal): Promise<number> {
    const value = await getText(this.url('/blocks/tip/height'), signal);
    return nonNegativeIntegerSchema.parse(value.trim());
  }

  async getTipHash(signal?: AbortSignal): Promise<string> {
    return hashSchema.parse((await getText(this.url('/blocks/tip/hash'), signal)).trim());
  }

  async getBlockHashByHeight(height: number, signal?: AbortSignal): Promise<string> {
    return hashSchema.parse((await getText(this.url(`/block-height/${height}`), signal)).trim());
  }

  async transactionExists(txid: string, signal?: AbortSignal): Promise<boolean> {
    return this.exists(`/tx/${txid}/status`, transactionStatusSchema, signal);
  }

  async blockExists(hash: string, signal?: AbortSignal): Promise<boolean> {
    return this.exists(`/block/${hash}`, blockSchema, signal);
  }

  async addressExists(address: string, signal?: AbortSignal): Promise<boolean> {
    return this.exists(`/address/${encodeURIComponent(address)}`, addressSchema, signal);
  }

  private async exists(path: string, schema: z.ZodType, signal?: AbortSignal): Promise<boolean> {
    try {
      await getJson(this.url(path), schema, signal);
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return false;
      throw error;
    }
  }
}
