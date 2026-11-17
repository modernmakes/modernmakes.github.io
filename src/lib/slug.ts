// toSlug lives here, import-free, so Node can load it directly (type stripping) for
// scripts/audit-hardware-links.mjs. Pages keep importing it from src/lib/hardware.ts.
export const toSlug = (name: string): string =>
  name.toLowerCase().replace(/\+/g, '-plus').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
