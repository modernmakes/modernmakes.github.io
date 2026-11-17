// The one slug rule for every hardware/printer URL. Import-free so Node scripts and
// astro.config.mjs can load it directly; pages import it via src/lib/hardware.ts.
// lowercase, "+" -> " plus ", each run outside [a-z0-9] -> "-", trim "-".
// Must stay identical to the Airtable "Slug" formula (checked by npm run audit:slugs).
export const toSlug = (name: string): string =>
  name.toLowerCase().replace(/\+/g, ' plus ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
