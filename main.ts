// Lantern Hunt — hand-in program (Node 22, standard library only).
//
// The game itself is plain static files under game/ (index.html plus its
// styles and ES modules, no library, no network request). This program is
// only the courier: it copies game/ and screenshots/ from beside this file
// into the output directory and writes dossier.json, the summary the judge
// reads, using the vendored make.fun library. It runs the same way twice,
// so both grader runs produce identical bytes.
//
// Local check:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Start from a clean output directory so a stale file can never leak in.
// Empty its contents, never the directory itself: the grader mounts the
// output directory (writable inside), but its parent is a read-only
// filesystem, so removing and recreating the directory fails outright.
mkdirSync(outDir, { recursive: true });
for (const entry of readdirSync(outDir)) {
  rmSync(join(outDir, entry), { recursive: true, force: true });
}

cpSync(join(repoRoot, 'game'), join(outDir, 'game'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The scorer's own caps, from the bounty gate: at most 4 screenshots of at
// most 256 KiB, at most 993 game files totalling 48 MiB, paths at most 1000
// bytes, and the dossier text capped at 160 KiB.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

console.log(`Lantern Hunt handed in to ${outDir}`);
