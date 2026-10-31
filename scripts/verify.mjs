import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { setTimeout } from 'node:timers/promises';

const root = resolve('public');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const manifestBytes = await readFile(resolve(root, 'margo-manifest.json'));
const manifest = JSON.parse(manifestBytes);
assert.equal(manifest.schemaVersion, 'margo-site-manifest/v1');
assert.equal(manifest.baseURL, 'https://carta.guigoes.com');
assert.ok(Array.isArray(manifest.entries) && manifest.entries.length > 0);
const entries = [];
for (const entry of manifest.entries) {
  const filename = resolve(root, entry.path);
  assert.ok(filename.startsWith(root + sep), `Invalid artifact path: ${entry.path}`);
  assert.equal(digest(await readFile(filename)), entry.digest, `Local artifact mismatch: ${entry.path}`);
  entries.push({ path: entry.path, digest: entry.digest });
}
entries.push({ path: 'margo-manifest.json', digest: digest(manifestBytes) });
const origin = process.argv[2];
if (!origin) {
  console.log(`Verified ${entries.length} local publication files.`);
} else {
  assert.equal(origin, manifest.baseURL, 'Verification origin must match the canonical origin.');
  const deadline = Date.now() + 180_000;
  let attempt = 0;
  for (;;) {
    attempt++;
    try {
      await Promise.all(entries.map(async entry => {
        const response = await fetch(new URL(entry.path, origin + '/'), { signal: AbortSignal.timeout(10_000), cache: 'no-store' });
        assert.equal(response.status, 200, `HTTP status: ${entry.path}`);
        assert.equal(new URL(response.url).origin, origin, `Unexpected redirect: ${entry.path}`);
        const type = response.headers.get('content-type')?.split(';')[0];
        const expected = entry.path.endsWith('.html') ? ['text/html'] : entry.path.endsWith('.css') ? ['text/css'] : entry.path.endsWith('.png') ? ['image/png'] : entry.path.endsWith('.svg') ? ['image/svg+xml'] : entry.path.endsWith('.json') ? ['application/json'] : entry.path.endsWith('.xml') ? ['application/xml', 'text/xml'] : ['text/plain'];
        assert.ok(expected.includes(type), `Unexpected MIME type for ${entry.path}: ${type}`);
        assert.equal(digest(new Uint8Array(await response.arrayBuffer())), entry.digest, `Public artifact mismatch: ${entry.path}`);
      }));
      const missing = await fetch(origin + '/__carta_missing_route__', { signal: AbortSignal.timeout(10_000) });
      assert.equal(missing.status, 404, 'Missing URLs must return HTTP 404.');
      const receipt = { origin, manifestDigest: manifest.digest, verifiedAt: new Date().toISOString(), attempts: attempt, files: entries.length, missingStatus: missing.status };
      await mkdir('output', { recursive: true });
      await writeFile('output/production-verification.json', JSON.stringify(receipt, null, 2) + '\n');
      console.log(JSON.stringify(receipt));
      break;
    } catch (error) {
      if (Date.now() >= deadline) throw error;
      await setTimeout(5000);
    }
  }
}
