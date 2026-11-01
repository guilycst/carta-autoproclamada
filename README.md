# Carta

A one-page political parody at [carta.guigoes.com](https://carta.guigoes.com). Fill in a name, title and place of government to create a fictional presidential proclamation, then download it as PNG or PDF.

The preview and both exports use the same canvas drawing. Everything runs in the browser, without sending form data to a server. Native file sharing is available when the browser supports it.

PNG output is 2160 × 3056 pixels. The single-page A4 PDF embeds that image, so its text is not selectable. A readable text transcript appears below the preview.

## Source

- `content/index.md` contains the interface.
- `src/letter.js` defines the parody text and draws the letter.
- `src/app.js` handles personalization, preview, downloads and sharing.
- `assets/` contains the visual assets, including the fictional coat of arms and its [generation prompt](assets/brasao-parodia-prompt.md).
- `scripts/build.mjs` bundles the browser code and builds the static site with Margo.

The letter is original satire, not an authentic declaration. The interface takes visual cues from the [Brazilian government design system](https://www.gov.br/ds) and is labeled as parody.

## Run locally

Requires Node.js 22+, Go 1.27.3+ and Python 3.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4173. Use `npm run build` to generate the static site in `public/`.

Run `npm test` to check the generated files, personalization, PNG/PDF exports and mobile layout. Browser tests use locally installed Google Chrome.
