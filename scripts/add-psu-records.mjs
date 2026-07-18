// Insert the two baseline Mean Well PSU records into the Hardware DB PSUs table.
//
// Schema-driven and dry-run-first, so the real field names are confirmed before
// anything is written (the PSUs table is NOT assumed to match the Hotends pattern):
//
//   node scripts/add-psu-records.mjs            # read schema, print field map + flags, write nothing
//   node scripts/add-psu-records.mjs --commit   # actually insert (typecast: true)
//
// Reads AIRTABLE_TOKEN from the environment (same convention as fetch-airtable.mjs).
// Set it in the VS Code terminal immediately before running; never commit or paste it.

const BASE_ID  = 'appt6uoXxkQJEe3Rp';           // Hardware DB
const TABLE_ID = 'tbl8vxrHDWKksQs1e';           // PSUs
const TOKEN    = process.env.AIRTABLE_TOKEN;
const API      = 'https://api.airtable.com/v0';
const COMMIT   = process.argv.includes('--commit');

// The values to write, as logical fields, mapped to the table's ACTUAL field names
// at runtime (see FIELD_MATCHERS) — not written under assumed names.
//
// Only LRS-600-24 is here. LRS-350-24 was requested too, but it ALREADY EXISTS in
// the table (record recrxTHwgMqPs4s2w: Price $59.99, Verdict "BUY", full write-up),
// so per the decision it is left untouched rather than duplicated or overwritten.
//
// Verdict is "BUY", not "Workhorse": the PSUs table still uses the legacy taxonomy
// (BUY/CONSIDER) and the site's resolveVerdict() renders BUY as a green Workhorse
// badge, so this stays consistent with the other 8 rows and avoids taxonomy drift.
const RECORDS = [
  {
    name: 'Mean Well LRS-600-24',
    brand: 'Mean Well',
    wattage: 600,
    voltage: '24V',   // "Output Voltage" is a TEXT field storing e.g. "24V", not a number
    price: 75,
    verdict: 'BUY',
    description:
      'For larger beds, enclosure/chamber heating, or higher total system draw where the ' +
      '350W unit runs too close to its ceiling. A 350mm+ DC bed, an active chamber heater, ' +
      'or an AWD/toolchanger stepper count can pull the continuous load toward or past ' +
      '350W; the LRS-600-24 restores headroom so the supply is not running near its limit. ' +
      'Same 24V rail and same Mean Well LRS reliability — just more margin.',
  },
];

// logical field -> ordered list of patterns tried against the real field names.
// First match wins, so put the most specific pattern first.
const FIELD_MATCHERS = {
  name:        [/^name$/i],
  brand:       [/^brand$/i, /brand|manufacturer|maker/i],
  wattage:     [/watt/i, /\bpower\b/i],
  voltage:     [/volt/i],
  price:       [/price/i, /\bcost\b/i, /\busd\b/i],
  description: [/^description$/i, /desc/i, /notes?/i],
  verdict:     [/^verdict$/i, /verdict/i],   // exact first, so it can't grab "Verdict Label"
};

async function airtable(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${text}`);
  return text ? JSON.parse(text) : {};
}

async function getPsuTable() {
  const data = await airtable('GET', `${API}/meta/bases/${BASE_ID}/tables`);
  const table = data.tables.find((t) => t.id === TABLE_ID);
  if (!table) throw new Error(`PSUs table ${TABLE_ID} not found in base ${BASE_ID}`);
  return table;
}

// Resolve one logical field to a real field object from the schema.
function matchField(table, logical) {
  const patterns = FIELD_MATCHERS[logical] || [];
  for (const pattern of patterns) {
    const hit = table.fields.find((f) => pattern.test(f.name));
    if (hit) return hit;
  }
  // "name" falls back to the table's primary field if nothing matched by name.
  if (logical === 'name') {
    return table.fields.find((f) => f.id === table.primaryFieldId) || null;
  }
  return null;
}

async function existingNames(nameField) {
  const names = new Set();
  let offset;
  do {
    const url = new URL(`${API}/${BASE_ID}/${TABLE_ID}`);
    url.searchParams.append('fields[]', nameField);
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);
    const page = await airtable('GET', url.toString());
    for (const rec of page.records) {
      const v = rec.fields[nameField];
      if (v) names.add(String(v).trim().toLowerCase());
    }
    offset = page.offset;
  } while (offset);
  return names;
}

async function main() {
  if (!TOKEN) {
    console.error('Error: AIRTABLE_TOKEN is not set. Set it in the VS Code terminal, then re-run.');
    process.exit(1);
  }

  const table = await getPsuTable();

  // ── Step 1: report the real schema ──────────────────────────────────────────
  console.log(`\nPSUs table: "${table.name}" (${table.id})`);
  console.log(`Primary field id: ${table.primaryFieldId}\n`);
  console.log('Actual fields:');
  for (const f of table.fields) {
    const primary = f.id === table.primaryFieldId ? ' [primary]' : '';
    let extra = '';
    if (f.type === 'singleSelect' || f.type === 'multipleSelects') {
      const choices = (f.options?.choices || []).map((c) => c.name);
      extra = ` — choices: [${choices.join(', ')}]`;
    }
    console.log(`  • ${f.name} (${f.type})${primary}${extra}`);
  }

  // ── Map logical values to real fields ───────────────────────────────────────
  const mapping = {};
  const unmatched = [];
  for (const logical of Object.keys(FIELD_MATCHERS)) {
    const field = matchField(table, logical);
    if (field) mapping[logical] = field;
    else unmatched.push(logical);
  }

  console.log('\nField mapping (logical value -> real field):');
  for (const logical of Object.keys(FIELD_MATCHERS)) {
    const f = mapping[logical];
    console.log(`  ${logical.padEnd(12)} -> ${f ? `"${f.name}" (${f.type})` : 'NO MATCH'}`);
  }

  // ── Flags ───────────────────────────────────────────────────────────────────
  const flags = [];
  if (unmatched.length) {
    flags.push(`Unmatched logical fields (their values will NOT be written): ${unmatched.join(', ')}`);
  }
  const verdictField = mapping.verdict;
  if (verdictField && verdictField.type === 'singleSelect') {
    const choices = (verdictField.options?.choices || []).map((c) => c.name);
    if (!choices.includes('Workhorse')) {
      flags.push(
        `Verdict field "${verdictField.name}" is a single-select whose choices are ` +
        `[${choices.join(', ')}] — "Workhorse" is NOT among them. With typecast:true the ` +
        `insert will CREATE the "Workhorse" choice. Remove it from the records or pre-add ` +
        `the choice if that is not what you want.`
      );
    }
  }
  if (flags.length) {
    console.log('\n⚠  Flags:');
    for (const f of flags) console.log(`  - ${f}`);
  } else {
    console.log('\nNo schema flags.');
  }

  // ── Build the records against real field names ──────────────────────────────
  const nameField = mapping.name?.name;
  if (!nameField) {
    console.error('\nAborting: could not resolve the Name/primary field — refusing to write blind.');
    process.exit(1);
  }
  const taken = await existingNames(nameField);

  const toWrite = [];
  const skipped = [];
  for (const rec of RECORDS) {
    if (taken.has(rec.name.toLowerCase())) {
      skipped.push(rec.name);
      continue;
    }
    const fields = {};
    for (const [logical, field] of Object.entries(mapping)) {
      if (rec[logical] !== undefined) fields[field.name] = rec[logical];
    }
    toWrite.push({ fields });
  }

  if (skipped.length) {
    console.log(`\nAlready present (skipped to avoid duplicates): ${skipped.join(', ')}`);
  }

  console.log(`\nRecords to insert (${toWrite.length}):`);
  console.log(JSON.stringify(toWrite, null, 2));

  if (!COMMIT) {
    console.log('\nDRY RUN — nothing written. Re-run with --commit to insert.');
    return;
  }
  if (!toWrite.length) {
    console.log('\nNothing to insert.');
    return;
  }

  // ── Step 2: insert (typecast:true so number/select coercion works) ──────────
  const result = await airtable('POST', `${API}/${BASE_ID}/${TABLE_ID}`, {
    records: toWrite,
    typecast: true,
  });

  // ── Step 3: report what was actually written ────────────────────────────────
  console.log(`\n✓ Inserted ${result.records.length} record(s):`);
  for (const rec of result.records) {
    console.log(`\n  id: ${rec.id}`);
    for (const [k, v] of Object.entries(rec.fields)) {
      const val = typeof v === 'string' && v.length > 80 ? v.slice(0, 80) + '…' : v;
      console.log(`    ${k}: ${JSON.stringify(val)}`);
    }
  }
}

main().catch((err) => {
  console.error(`\nFailed: ${err.message}`);
  process.exit(1);
});
