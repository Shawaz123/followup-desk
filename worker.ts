interface Env {
  ASSETS: Fetcher;
  API_ORIGIN?: string;
}

const DEFAULT_API_ORIGIN = 'https://followup-desk-api.onrender.com';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/') || url.pathname === '/mcp') {
      const origin = (env.API_ORIGIN || DEFAULT_API_ORIGIN).replace(/\/+$/, '');
      const upstream = new URL(url.pathname + url.search, origin);
      const headers = new Headers(request.headers);
      // The Worker is the browser-facing origin; CORS is not needed between it and the API.
      headers.delete('origin');
      headers.delete('host');
      return fetch(new Request(upstream, { method: request.method, headers, body: request.body, redirect: 'manual' }));
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
