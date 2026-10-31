import { build } from 'esbuild';
import { mkdir, readFile, writeFile, rm, rename, copyFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const bundle = await build({ entryPoints: ['src/app.js'], bundle: true, minify: true, write: false, format: 'iife', target: ['es2020'] });
const source = await readFile('content/index.md', 'utf8');
const placeholder = '/* CARTA_BUNDLE */';
if (source.split(placeholder).length !== 2) throw new Error('Expected exactly one app bundle placeholder.');
await mkdir('.build/content/assets', { recursive: true });
await copyFile('assets/brasao-parodia.png', '.build/content/assets/brasao-parodia.png');
await writeFile('.build/content/index.md', source.replace(placeholder, () => bundle.outputFiles[0].text.replace(/<\/script/gi, '<\\/script')));
await rm('.build/public', { recursive: true, force: true });
execFileSync('go', ['run', 'github.com/araihu/margo/cmd/margo@v0.0.35', 'site', 'site.yaml', '--allow-unsafe-html'], { stdio: 'inherit', env: { ...process.env, GOWORK: 'off' } });
await rm('public', { recursive: true, force: true });
await rename('.build/public', 'public');
console.log('Built Carta with Margo v0.0.35.');
