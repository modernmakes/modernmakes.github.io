import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const BASE_ID = 'appt6uoXxkQJEe3Rp';
const TOKEN   = process.env.AIRTABLE_TOKEN;
const OUT_DIR = 'src/data/hardware';

const TABLES = [
  { name: 'hotends',          id: 'tblWYO1fRFXcY6fXF' },
  { name: 'extruders',        id: 'tblTWR36Uq0RM4TB2' },
  { name: 'toolheads',        id: 'tblfmSZtQvt4XQetS' },
  { name: 'bed-probes',       id: 'tblbKbuuUQhCSX38C' },
  { name: 'nozzles',          id: 'tblGOrDOH1cBBjgUv' },
  { name: 'build-plates',     id: 'tblmKDQDt0wHypEjx' },
  { name: 'mainboards',       id: 'tbl7zcODDUtBp63PX' },
  { name: 'toolboards',       id: 'tblPaWOgRQDq6TrwH' },
  { name: 'part-cooling',     id: 'tblCzOd1Crf4K9ZkO' },
  { name: 'air-filtration',   id: 'tblPecAiQBq1Wbuy6' },
  { name: 'enclosures',       id: 'tbldFKTCpesINRv3n' },
  { name: 'filament-dryers',  id: 'tblAFI1uYCz9ovbJI' },
  { name: 'heaters',          id: 'tbleG8nGHrCiVWPRP' },
  { name: 'psus',             id: 'tbl8vxrHDWKksQs1e' },
  { name: 'gantrys',          id: 'tblbofl1tnNRRHdaH' },
  { name: 'motion-system',    id: 'tbl2CQ6TAnkwprQkX' },
  { name: 'lighting-cameras', id: 'tbljCecwZZPXMsSoI' },
  { name: 'motors',           id: 'tblRXZNO0ITQeNg9q' },
  // Filament (tblCD21uNiq1db1HC) is empty and unused; re-add here if it is ever populated.
  { name: 'printers',         id: 'tblboLo18BZ2k0E9n' },
];

function httpError(res, body) {
  const err = new Error(`HTTP ${res.status} — ${body}`);
  err.status = res.status;
  return err;
}

// Write only after a successful fetch. A fetch that "succeeds" with 0 records over a file that
// has data is treated as a failure too, so a bad filter or lost permission can't blank the site.
async function saveJson(path, records) {
  if (records.length === 0 && existsSync(path)) {
    try {
      const prev = JSON.parse(await readFile(path, 'utf-8'));
      if (Array.isArray(prev) && prev.length > 0) {
        throw new Error(`returned 0 records but ${path} has ${prev.length}; keeping the existing file`);
      }
    } catch (err) {
      if (err instanceof SyntaxError) { /* unreadable old file: fine to replace */ } else throw err;
    }
  }
  await writeFile(path, JSON.stringify(records, null, 2), 'utf-8');
}

async function fetchTable(tableId) {
  const records = [];
  let offset;

  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${tableId}`);
    if (offset) url.searchParams.set('offset', offset);

    const res = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${TOKEN}` },
    });

    if (!res.ok) throw httpError(res, await res.text());

    const buffer = await res.arrayBuffer();
    const data = JSON.parse(new TextDecoder('utf-8').decode(buffer));

    for (const record of data.records) {
      records.push({ id: record.id, ...record.fields });
    }

    offset = data.offset;
  } while (offset);

  return records;
}

const NL_BASE  = 'appjJWszZBOS13e0i';
const NL_TABLE = 'tblgCX2IZ2e0hHOaD';
const NL_FIELDS = [
  'Issue name', 'Subject line', 'Status', 'Issue Number',
  'Send Date', 'BeeHiiv Issue URL', 'Subscribers at Send', 'Open Rate (%)',
];

async function fetchNewsletterArchive() {
  const records = [];
  let offset;

  do {
    const url = new URL(`https://api.airtable.com/v0/${NL_BASE}/${NL_TABLE}`);
    url.searchParams.set('filterByFormula', '{Status}="Sent"');
    url.searchParams.set('sort[0][field]', 'Issue Number');
    url.searchParams.set('sort[0][direction]', 'desc');
    NL_FIELDS.forEach(f => url.searchParams.append('fields[]', f));
    if (offset) url.searchParams.set('offset', offset);

    const res = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${TOKEN}` },
    });

    if (!res.ok) throw httpError(res, await res.text());

    const buffer = await res.arrayBuffer();
    const data = JSON.parse(new TextDecoder('utf-8').decode(buffer));

    for (const record of data.records) {
      const f = record.fields;
      records.push({
        issueNumber:      f['Issue Number']         ?? 0,
        issueName:        f['Issue name']            ?? '',
        subjectLine:      f['Subject line']          ?? '',
        sendDate:         f['Send Date']             ?? '',
        beehiivUrl:       f['BeeHiiv Issue URL']     ?? '',
        subscribersAtSend: f['Subscribers at Send']  ?? 0,
        openRate:         f['Open Rate (%)']         ?? 0,
      });
    }

    offset = data.offset;
  } while (offset);

  return records;
}

async function main() {
  if (!TOKEN) {
    console.error('Error: AIRTABLE_TOKEN environment variable is not set.');
    process.exit(1);
  }

  if (!existsSync(OUT_DIR)) {
    await mkdir(OUT_DIR, { recursive: true });
  }

  let exported = 0;
  const failures = []; // { name, status, message }

  for (const table of TABLES) {
    process.stdout.write(`Fetching ${table.name}... `);
    try {
      const records = await fetchTable(table.id);
      await saveJson(join(OUT_DIR, `${table.name}.json`), records);
      console.log(`done (${records.length} records)`);
      exported++;
    } catch (err) {
      console.error(`failed: ${err.message}`);
      failures.push({ name: table.name, status: err.status ?? 'n/a', message: err.message.slice(0, 200) });
    }
  }

  console.log(`
Export complete: ${exported}/${TABLES.length} hardware tables exported`);

  // Freshness label (palette footer, hardware index headers): only when real data arrived.
  if (exported > 0) {
    await writeFile(join(OUT_DIR, '_synced.json'), JSON.stringify({ synced: new Date().toISOString() }, null, 2) + '\n', 'utf-8');
  }

  // Newsletter archive (separate base: appjJWszZBOS13e0i)
  process.stdout.write('Fetching newsletter-archive... ');
  try {
    const nlRecords = await fetchNewsletterArchive();
    await saveJson('src/data/newsletter-archive.json', nlRecords);
    console.log(`done (${nlRecords.length} records)`);
  } catch (err) {
    console.error(`failed: ${err.message}`);
    failures.push({ name: 'newsletter-archive', status: err.status ?? 'n/a', message: err.message.slice(0, 200) });
  }

  if (failures.length > 0) {
    console.error(`
SYNC FAILED: ${failures.length} source(s) did not update (existing JSON files left untouched):`);
    for (const f of failures) console.error(`  - ${f.name}: HTTP ${f.status}`);
    if (failures.some(f => f.status === 401 || f.status === 403)) {
      console.error('401/403 usually means the AIRTABLE_TOKEN secret is missing, expired or lacks access.');
    }
    process.exitCode = 1;
  }
}

main();
