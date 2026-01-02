/**
 * Web API Client
 * Uses the shared core's NextDNSApi with a custom HTTP adapter
 * that routes through the Cloudflare proxy (/api/nextdns)
 */
import { NextDNSApi, type HttpAdapter } from '@core/index';

const BASE_URL = '/api/nextdns';

/**
 * HTTP adapter for browser that routes through Cloudflare proxy
 */
const proxyHttpAdapter: HttpAdapter = {
  async request<T>(
    url: string,
    options: { method?: string; headers?: Record<string, string>; body?: string }
  ): Promise<{ status: number; data: T }> {
    // Convert full NextDNS URL to proxy URL
    // e.g., https://api.nextdns.io/profiles -> /api/nextdns/profiles
    const proxyUrl = url.replace('https://api.nextdns.io', BASE_URL);

    const response = await fetch(proxyUrl, {
      method: options.method || 'GET',
      headers: options.headers,
      body: options.body,
    });

    if (response.status === 204) {
      return { status: 204, data: {} as T };
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      const errorData = data as { errors?: { message?: string; code?: string }[] };
      const errorMessage =
        errorData.errors?.[0]?.message || errorData.errors?.[0]?.code || 'Request failed';
      throw new Error(errorMessage);
    }

    return { status: response.status, data };
  },
};

/**
 * Singleton API client instance for web app
 * Uses the shared NextDNSApi with proxy adapter
 */
export const api = new NextDNSApi({}, proxyHttpAdapter);
