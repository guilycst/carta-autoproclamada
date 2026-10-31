import { PDFDocument } from 'pdf-lib';
import { cleanText, createLetter, renderLetter, PAGE_WIDTH, PAGE_HEIGHT } from './letter.js';

async function initialize() {
  const form = document.querySelector('#letter-form');
  const preview = document.querySelector('#letter-preview');
  const status = document.querySelector('#export-status');
  const transcript = document.querySelector('#letter-transcript');
  const share = document.querySelector('#share-letter');
  const buttons = [...form.elements].filter(element => element.tagName === 'BUTTON');
  const emblem = document.querySelector('#national-emblem');
  buttons.forEach(button => { button.disabled = true; });
  try {
    await emblem.decode();
  } catch {
    status.textContent = 'Não foi possível carregar o brasão. Recarregue a página para gerar a carta.';
    return;
  }
  buttons.forEach(button => { button.disabled = false; });

  function currentLetter() { return createLetter(Object.fromEntries(new FormData(form))); }

  function update() {
    const letter = currentLetter();
    renderLetter(preview, letter, emblem);
    transcript.replaceChildren();
    for (const text of ['Carta à nação', letter.date, ...letter.paragraphs, letter.name, `${letter.title} por vontade própria`, 'Paródia. Sem valor oficial. carta.guigoes.com']) {
      const paragraph = document.createElement('p'); paragraph.textContent = text; transcript.append(paragraph);
    }
    status.textContent = '';
  }

  function pngBlob(canvas) {
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG generation failed.')), 'image/png'));
  }

  function download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename;
    document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  async function exportLetter(format) {
    if (!form.reportValidity()) return;
    if (!cleanText(form.elements.name.value, 80)) { form.elements.name.focus(); status.textContent = 'Preencha seu nome para gerar a carta.'; return; }
    const letter = currentLetter();
    buttons.forEach(button => { button.disabled = true; });
    status.textContent = 'Preparando sua autoproclamação…';
    try {
      const canvas = document.createElement('canvas'); canvas.width = PAGE_WIDTH * 2; canvas.height = PAGE_HEIGHT * 2;
      renderLetter(canvas, letter, emblem);
      const png = await pngBlob(canvas);
      if (format === 'pdf') {
        const pdf = await PDFDocument.create();
        pdf.setTitle(`Carta de autoproclamação de ${letter.name}`);
        pdf.setSubject('Paródia. Sem valor oficial. carta.guigoes.com');
        pdf.setCreator('carta.guigoes.com');
        const image = await pdf.embedPng(await png.arrayBuffer());
        const page = pdf.addPage([595.28, 841.89]);
        page.drawImage(image, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
        download(new Blob([await pdf.save()], { type: 'application/pdf' }), 'minha-autoproclamacao.pdf');
      } else if (format === 'share') {
        const files = [new File([png], 'minha-autoproclamacao.png', { type: 'image/png' })];
        if (!navigator.canShare?.({ files })) { download(png, 'minha-autoproclamacao.png'); status.textContent = 'Seu navegador não compartilha arquivos. PNG baixado para você enviar.'; return; }
        await navigator.share({ files, title: 'Minha carta de autoproclamação' });
      } else download(png, 'minha-autoproclamacao.png');
      status.textContent = format === 'share' ? 'Carta compartilhada.' : `${format.toUpperCase()} pronto. Sua faixa presidencial continua por sua conta.`;
    } catch (error) {
      status.textContent = error.name === 'AbortError' ? 'Compartilhamento cancelado.' : 'Não foi possível gerar o arquivo. Tente baixar novamente.';
    } finally { buttons.forEach(button => { button.disabled = false; }); }
  }

  form.addEventListener('input', update);
  form.addEventListener('submit', event => { event.preventDefault(); exportLetter('png'); });
  document.querySelector('#download-pdf').addEventListener('click', () => exportLetter('pdf'));
  share.addEventListener('click', () => exportLetter('share'));
  share.hidden = !navigator.share || !navigator.canShare;
  update();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
else initialize();
