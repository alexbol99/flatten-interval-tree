// Generate TypeScript declaration shims next to bundles so editors can pick up types
// when importing from './dist/main.mjs' or './dist/main.cjs'.
// This script runs after rollup build.
import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = resolve(__dirname, '..', 'dist');

const shimContent = `export * from './index';
export { default } from './classes/IntervalTree';
`;

async function run() {
  const targets = ['main.d.ts', 'main.mjs.d.ts', 'main.cjs.d.ts'];
  await Promise.all(
    targets.map((name) => writeFile(resolve(distDir, name), shimContent, 'utf8'))
  );
}

run().catch((err) => {
  console.error('postbuild failed to create d.ts shims:', err);
  process.exitCode = 1;
});
