# Carta

A one-page political parody at `carta.guigoes.com`. Visitors personalize a fictional presidential proclamation and download matching PNG and A4 PDF files. The letter is original parody text inspired by the October 28, 2026 incident, not a transcription or authentic declaration.

The interface takes visual cues from the [Brazilian government design system](https://www.gov.br/ds), with blue controls, a white background, and green/yellow accents. It remains visibly labeled as parody. The fictional coat of arms in `assets/brasao-parodia.png` was generated with the built-in imagegen tool. Its ribbon says "REPÚBLICA AUTOPROCLAMADA DO BRAZIL", with deliberately uneven heraldic details. [The exact generation prompt](assets/brasao-parodia-prompt.md) records its provenance. The original reference, `assets/brasao.jpg`, is the unchanged JPEG from the [official Cemaden/MCTI archive](https://www.gov.br/cemaden/pt-br/centrais-de-conteudo/logomarcas/brasao-da-republica/brasao-oficial.zip/@@download/file), downloaded on October 31, 2026. The parody image appears in the header, social preview and both exports; no third-party request is needed at runtime.

## Run locally

Requires Node.js 22+, Go 1.27.3+ and Python 3 for the local preview server.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4173. `npm run build` generates `public/` with pinned Margo v0.0.35. The build bundles the reviewed browser code into Markdown before Margo renders it. It does not rewrite generated HTML. Margo's unsafe HTML option applies only to trusted authored source. User input stays in canvas text and DOM `textContent`.

`content/index.md` owns the interface. `src/letter.js` owns the text and drawing shared by the preview and both exports. `src/app.js` owns the form, downloads and optional native file sharing. Browser code and PDF generation run locally, without analytics, storage or user-data requests.

PNG output is 2160 × 3056 pixels. The A4 PDF embeds that image and therefore does not contain selectable text. The accessible text transcript is available below the preview. Native sharing depends on browser support, HTTPS and permission; PNG download remains available.

## Validate

```sh
npm test
```

Browser tests use locally installed Google Chrome, or Playwright Chromium in CI, and validate personalized downloads, long names, input treated as text, a single A4 PDF page and mobile overflow. Review generated screenshots and exported files under `output/`. `scripts/verify.mjs` checks each built file against Margo's SHA-256 manifest before browser tests.

## Publication

Source: https://github.com/guilycst/carta-autoproclamada. Cloudflare Worker `carta-guigoes` serves the static publication at https://carta.guigoes.com. `wrangler.jsonc` owns the custom domain and asset routing. The blog has its own independent Worker.

```sh
npm test
npm run dry-run
npm run deploy
```

GitHub Actions is the production publisher. Pull requests build, verify the manifest, run browser tests and package a dry run without deployment credentials. Main builds upload the validated publication; a separate job downloads that exact artifact, verifies its bytes, rejects stale main commits, deploys and checks every public file plus a missing URL. Verification retries propagation for up to three minutes and preserves a receipt as an Actions artifact.

The repository secret `CLOUDFLARE_API_TOKEN` authenticates only the deploy step. Its Cloudflare permissions are Workers Scripts Write for the hosting account and Zone Read for `guigoes.com`. No API token belongs in Git. `workers.dev` and version preview URLs are disabled. Only `public/` is served, excluding source files, browser-test outputs and filled sample letters.

For an explicitly authorized manual recovery, `npm run deploy` publishes the existing `public/` artifact without rebuilding it. Authenticate Wrangler with the hosting account first, then run `npm run verify` against that same artifact. Normal releases use the main-branch workflow.
