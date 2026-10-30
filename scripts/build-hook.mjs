// PostToolUse hook: run the site build only when an edited file can affect the site.
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIRS = ['src', 'public', 'scripts'];
const FILES = ['astro.config.mjs', 'package.json', 'tsconfig.json'];

// Windows paths are case-insensitive and may use either slash.
const norm = (p) => path.resolve(p.replace(/\\/g, '/')).replace(/\\/g, '/').toLowerCase();

function isSiteFile(filePath) {
  const rel = path.posix.relative(norm(ROOT), norm(filePath));
  if (!rel || rel.startsWith('..') || path.posix.isAbsolute(rel)) return false;
  return FILES.includes(rel) || DIRS.some((d) => rel.startsWith(d + '/'));
}

let input = '';
process.stdin.on('data', (c) => (input += c));
process.stdin.on('end', () => {
  let filePath;
  try { filePath = JSON.parse(input)?.tool_input?.file_path; } catch {}
  if (typeof filePath !== 'string' || !isSiteFile(filePath)) process.exit(0);
  try {
    const out = execSync('npm run build 2>&1', { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    console.log(out.split('\n').slice(-20).join('\n'));
  } catch (e) {
    // Show build errors to Claude, but don't fail the hook.
    console.log(String(e.stdout || e.message).split('\n').slice(-20).join('\n'));
  }
  process.exit(0);
});
