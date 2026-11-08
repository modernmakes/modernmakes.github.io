// Command palette index, built once per deploy. Fetched on first palette open, never with the page.
import type { APIRoute } from 'astro';
import { buildSearchIndex } from '../lib/search-index';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await buildSearchIndex()), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
