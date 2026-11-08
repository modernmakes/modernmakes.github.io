// "Hardware data synced 6 h ago" from the ISO time fetch-airtable.mjs writes to
// src/data/hardware/_synced.json. Null when missing, unreadable or older than 72 h
// (stale data gets no label rather than a scary one). Computed in the browser so it
// stays true however long ago the page was built.
export function syncedLabel(iso, now = Date.now()) {
  const t = typeof iso === 'string' ? Date.parse(iso) : NaN;
  if (!Number.isFinite(t)) return null;
  const min = Math.max(0, (now - t) / 60000); // a clock a little behind the server reads "1 min"
  if (min > 72 * 60) return null;
  const ago = min < 60 ? `${Math.max(1, Math.floor(min))} min`
    : min < 48 * 60 ? `${Math.floor(min / 60)} h`
    : `${Math.floor(min / 1440)} days`;
  return `Hardware data synced ${ago} ago`;
}
