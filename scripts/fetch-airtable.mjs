import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const BASE_ID = 'appt6uoXxkQJEe3Rp';
const TOKEN   = process.env.AIRTABLE_TOKEN;
const OUT_DIR = 'src/data/hardware';

const TABLES = [
  { name: 'hotends',          id: 'tblWYO1fRFXcY6fXF' },
  { name: 'extruders',        id: 'tblTWR36Uq0RM4TB2' },
  { name: 'bed-probes',       id: 'tblbKbuuUQhCSX38C' },
  { name: 'nozzles',          id: 'tblGOrDOH1cBBjgUv' },
  { name: 'build-plates',     id: 'tblmKDQDt0wHypEjx' },
  { name: 'mainboards',       id: 'tbl7zcODDUtBp63PX' },
  { name: 'toolboards',       id: 'tblPaWOgRQDq6TrwH' },
  { name: 'part-cooling',     id: 'tblCzOd1Crf4K9ZkO' },
  { name: 'air-filtration',   id: 'tblPecAiQBq1Wbuy6' },
  { name: 'enclosure',        id: 'tbldFKTCpesINRv3n' },
  { name: 'filament-dryers',  id: 'tblAFI1uYCz9ovbJI' },
  { name: 'heaters',          id: 'tbleG8nGHrCiVWPRP' },
  { name: 'psus',             id: 'tbl8vxrHDWKksQs1e' },
  { name: 'gantrys',          id: 'tblbofl1tnNRRHdaH' },
  { name: 'motion-system',    id: 'tbl2CQ6TAnkwprQkX' },
  { name: 'lighting-cameras', id: 'tbljCecwZZPXMsSoI' },
  { name: 'filament',         id: 'tblCD21uNiq1db1HC' },
  { name: 'printers',         id: 'tblboLo18BZ2k0E9n' },
];

async function fetchTable(tableId) {
  const records = [];
  let offset;

  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${tableId}`);
    if (offset) url.searchParams.set('offset', offset);

    const res = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${TOKEN}` },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} — ${await res.text()}`);
    }

    const data = await res.json();

    for (const record of data.records) {
      records.push({ id: record.id, ...record.fields });
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

  for (const table of TABLES) {
    process.stdout.write(`Fetching ${table.name}... `);
    try {
      const records = await fetchTable(table.id);
      await writeFile(join(OUT_DIR, `${table.name}.json`), JSON.stringify(records, null, 2), 'utf-8');
      console.log(`done (${records.length} records)`);
      exported++;
    } catch (err) {
      console.error(`failed: ${err.message}`);
    }
  }

  console.log(`\nExport complete: ${exported}/${TABLES.length} tables exported`);
}

main();
