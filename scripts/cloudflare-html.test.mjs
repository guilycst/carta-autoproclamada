import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { removeCloudflareJavaScriptDetection, assertNoCloudflareChallenge } from './cloudflare-html.mjs';

const script = await readFile(new URL('./fixtures/cloudflare-jsd.html', import.meta.url), 'utf8');

test('classifies only an explicit Cloudflare HTTP 403 challenge as blocked', () => {
  assert.throws(() => assertNoCloudflareChallenge(403, 'challenge', '/'), { code: 'CLOUDFLARE_CHALLENGE' });
  for (const [status, mitigated] of [[403, null], [500, 'challenge'], [200, 'challenge'], [404, null]]) {
    assert.doesNotThrow(() => assertNoCloudflareChallenge(status, mitigated, '/'));
  }
});

test('ignores only the reviewed Cloudflare edge script immediately before body closes', () => {
  const prefix = '<html><body><main>Authored content</main>';
  assert.equal(removeCloudflareJavaScriptDetection(prefix + script + '</body></html>'), prefix + '</body></html>');
  const changedRay = script.replaceAll('a5369a9c88c9c134', '1234567890abcdef');
  assert.equal(removeCloudflareJavaScriptDetection(prefix + changedRay + '</body></html>'), prefix + '</body></html>');
  for (const unrecognized of [
    '<script>alert("unexpected")</script>',
    script.replace('/cdn-cgi/challenge-platform/scripts/jsd/main.js', 'https://example.com/changed.js'),
    script.replace("a.height=1;", "a.height=2;"),
    script + '<p>Not the end of the body</p>'
  ]) {
    const html = prefix + unrecognized + '</body></html>';
    assert.equal(removeCloudflareJavaScriptDetection(html), html);
  }
});
