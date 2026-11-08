// Self-check for the freshness label: node scripts/check-synced.mjs
import assert from 'node:assert/strict';
import { syncedLabel } from '../src/scripts/synced.js';

const now = Date.parse('2026-11-08T12:00:00Z');
const ago = (min) => new Date(now - min * 60000).toISOString();
assert.equal(syncedLabel(ago(0.2), now), 'Hardware data synced 1 min ago');
assert.equal(syncedLabel(ago(25), now), 'Hardware data synced 25 min ago');
assert.equal(syncedLabel(ago(6 * 60 + 10), now), 'Hardware data synced 6 h ago');
assert.equal(syncedLabel(ago(50 * 60), now), 'Hardware data synced 2 days ago');
assert.equal(syncedLabel(ago(72 * 60), now), 'Hardware data synced 3 days ago');
assert.equal(syncedLabel(ago(72 * 60 + 1), now), null);
assert.equal(syncedLabel(ago(-5), now), 'Hardware data synced 1 min ago');
assert.equal(syncedLabel(null, now), null);
assert.equal(syncedLabel('not a date', now), null);
console.log('syncedLabel: ok');
