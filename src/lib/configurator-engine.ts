// ─────────────────────────────────────────────────────────────────────────────
// Voron configurator compatibility engine — pure functions, no framework
// coupling. Same role as resolveVerdict() in src/lib/hardware.ts: a single
// source of truth for "is this part compatible", not a check scattered
// across every subsystem grid.
//
// A record is incompatible only when the data actually says so. A missing
// or empty field (e.g. Nozzles have no Compatible Printers/Compatible
// Toolheads at all) is treated as "no signal" and never excludes a part —
// see CLAUDE.md's hardware field notes for which tables have which fields.
// ─────────────────────────────────────────────────────────────────────────────

export type PartRecord = Record<string, any>;

export interface Machine {
  model: '2.4' | 'trident';
}

export interface IncompatiblePart {
  record: PartRecord;
  reasons: string[];
}

export interface CompatibilityResult {
  compatible: PartRecord[];
  incompatible: IncompatiblePart[];
}

export type ReasonCheck = (record: PartRecord) => string | null;

const MACHINE_LABELS: Record<Machine['model'], string> = {
  '2.4': 'Voron 2.4',
  trident: 'Voron Trident',
};

const asStringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim() !== '') : [];

const norm = (s: unknown): string => (typeof s === 'string' ? s.trim().toLowerCase() : '');

// ── Individual checks — each returns a plain-language reason, or null if OK ──

export const machineCheck = (machine: Machine): ReasonCheck => {
  const label = MACHINE_LABELS[machine.model];
  return (record) => {
    const compatiblePrinters = asStringArray(record['Compatible Printers']);
    if (compatiblePrinters.length === 0) return null; // no data — can't exclude
    const ok = compatiblePrinters.some((p) => norm(p) === norm(label));
    return ok ? null : `Not listed for ${label}`;
  };
};

export const toolheadCheck = (toolheadName: string | null): ReasonCheck => (record) => {
  if (!toolheadName) return null;
  const compatibleToolheads = asStringArray(record['Compatible Toolheads']);
  if (compatibleToolheads.length === 0) return null; // field absent for this table, or no data
  const ok = compatibleToolheads.some((t) => norm(t) === norm(toolheadName));
  return ok ? null : `Requires a different toolhead than ${toolheadName}`;
};

// Cross-link 1: Heaters.Compatible Hotends (direct field).
export const heaterHotendCheck = (selectedHotend: PartRecord | null): ReasonCheck => (heater) => {
  if (!selectedHotend) return null;
  const hotendName = selectedHotend['Name'];
  if (!hotendName) return null;
  const compatibleHotends = asStringArray(heater['Compatible Hotends']);
  if (compatibleHotends.length === 0) return null; // no data — can't exclude
  const ok = compatibleHotends.some((h) => norm(h) === norm(hotendName));
  return ok ? null : `Not listed for the ${hotendName} hotend`;
};

// Cross-link 2: Hotend.Nozzle Thread === Nozzle.Thread (string match).
export const nozzleThreadCheck = (selectedHotend: PartRecord | null): ReasonCheck => (nozzle) => {
  if (!selectedHotend) return null;
  const hotendThread = selectedHotend['Nozzle Thread'];
  const nozzleThread = nozzle['Thread'];
  if (!hotendThread || !nozzleThread) return null; // no data on one side — can't exclude
  return norm(hotendThread) === norm(nozzleThread)
    ? null
    : `Thread doesn't match your hotend (needs ${hotendThread})`;
};

// ── Boolean "matches your X" taggers — used to highlight, not to exclude ──

export const nozzleMatchesHotend = (nozzle: PartRecord, selectedHotend: PartRecord | null): boolean => {
  if (!selectedHotend) return false;
  const hotendThread = selectedHotend['Nozzle Thread'];
  const nozzleThread = nozzle['Thread'];
  if (!hotendThread || !nozzleThread) return false;
  return norm(hotendThread) === norm(nozzleThread);
};

export const heaterMatchesHotend = (heater: PartRecord, selectedHotend: PartRecord | null): boolean => {
  if (!selectedHotend) return false;
  const hotendName = selectedHotend['Name'];
  if (!hotendName) return false;
  const compatibleHotends = asStringArray(heater['Compatible Hotends']);
  if (compatibleHotends.length === 0) return false;
  return compatibleHotends.some((h) => norm(h) === norm(hotendName));
};

// ── Runner — applies every check, splits the list, keeps plain-language reasons ──

export function evaluateCompatibility(records: PartRecord[], checks: ReasonCheck[]): CompatibilityResult {
  const compatible: PartRecord[] = [];
  const incompatible: IncompatiblePart[] = [];

  for (const record of records) {
    const reasons = checks
      .map((check) => check(record))
      .filter((r): r is string => r !== null);

    if (reasons.length > 0) incompatible.push({ record, reasons });
    else compatible.push(record);
  }

  return { compatible, incompatible };
}
