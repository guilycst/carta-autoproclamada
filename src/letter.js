export const PAGE_WIDTH = 1080;
export const PAGE_HEIGHT = 1528;

export function cleanText(value, limit) {
  return Array.from(value.replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, ' ').replace(/\s+/g, ' ').trim()).slice(0, limit).join('');
}

export function createLetter({ name, title, location }, now = new Date()) {
  name = cleanText(name, 80) || 'Seu nome aqui';
  title = title === 'presidenta' ? 'presidenta' : 'presidente';
  location = cleanText(location, 60) || 'sofá da sala';
  return {
    name, title, location,
    date: new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'America/Sao_Paulo' }).format(now),
    paragraphs: [
      `Dirijo-me ao povo brasileiro e à comunidade internacional para comunicar que eu, ${name}, me declaro ${title === 'presidenta' ? 'a verdadeira' : 'o verdadeiro'} ocupante da Presidência da República. A principal prova da minha legitimidade é que esta carta tem um brasão.`,
      'Não obtive a maioria dos votos. Em alguns cenários, sequer fui uma opção. Ainda assim, após consultar minha própria opinião, constatei uma vitória incontestável.',
      `Exercerei o cargo a distância. Local escolhido: ${location}. Não abandonei o Brasil. Apenas escolhi um lugar com melhores condições para reclamar dele.`,
      'Agradeço o apoio do grupo da família, das vozes da minha cabeça e de todos que responderam "kkkk". Interpreto essas manifestações como reconhecimento internacional.',
      'A partir deste momento, exijo o tratamento devido ao cargo que acabo de inventar. Quem discordar poderá redigir sua própria carta.'
    ]
  };
}

export function wrapText(context, text, width) {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width <= width) { line = candidate; continue; }
    if (line) lines.push(line);
    line = '';
    for (const character of Array.from(word)) {
      if (line && context.measureText(line + character).width > width) { lines.push(line); line = ''; }
      line += character;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function renderLetter(canvas, letter, emblem) {
  const context = canvas.getContext('2d');
  context.save();
  context.scale(canvas.width / PAGE_WIDTH, canvas.height / PAGE_HEIGHT);
  context.fillStyle = '#fff'; context.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  context.drawImage(emblem, 430, 0, 220, 220);
  context.textAlign = 'center'; context.fillStyle = '#071d41';
  context.font = 'bold 17px Arial'; context.fillText('REPÚBLICA AUTOPROCLAMADA DO BRAZIL', 540, 222);
  context.font = 'bold 46px Georgia'; context.fillText('Carta à nação', 540, 291);
  context.fillStyle = '#526270'; context.font = '20px Arial'; context.fillText(letter.date, 540, 335);
  const width = 860;
  let size = 30;
  let paragraphs;
  for (; size >= 23; size--) {
    context.font = `${size}px Arial`;
    paragraphs = letter.paragraphs.map(text => wrapText(context, text, width));
    if (paragraphs.reduce((sum, lines) => sum + lines.length * size * 1.43 + size * .8, 0) <= 760) break;
  }
  if (size < 23) { context.restore(); throw new Error('Letter exceeds one page.'); }
  context.fillStyle = '#1f2930'; context.textAlign = 'left';
  let y = 413;
  for (const lines of paragraphs) {
    for (let i = 0; i < lines.length; i++) {
      const words = lines[i].split(' ');
      if (i < lines.length - 1 && words.length > 1) {
        const spacing = (width - words.reduce((sum, word) => sum + context.measureText(word).width, 0)) / (words.length - 1);
        let x = 110;
        for (const word of words) { context.fillText(word, x, y); x += context.measureText(word).width + spacing; }
      } else context.fillText(lines[i], 110, y);
      y += size * 1.43;
    }
    y += size * .8;
  }
  context.textAlign = 'center'; context.fillStyle = '#071d41';
  let signatureSize = 34;
  let signatureLines;
  do {
    context.font = `bold ${signatureSize--}px Georgia`;
    signatureLines = wrapText(context, letter.name, width);
  } while (signatureLines.length > 2 && signatureSize > 18);
  signatureLines.forEach((line, index) => context.fillText(line, 540, signatureLines.length === 1 ? 1230 : 1210 + index * 36));
  context.font = '22px Arial'; context.fillText(`${letter.title[0].toUpperCase() + letter.title.slice(1)} por vontade própria`, 540, signatureLines.length === 1 ? 1266 : 1282);
  context.save(); context.translate(540, 1350); context.rotate(-.065); context.strokeStyle = '#a42532'; context.fillStyle = '#a42532'; context.lineWidth = 3;
  context.strokeRect(-172, -28, 344, 52); context.font = 'bold 24px Arial'; context.fillText(letter.title === 'presidenta' ? 'AUTOPROCLAMADA' : 'AUTOPROCLAMADO', 0, 6); context.restore();
  context.fillStyle = '#526270'; context.font = '19px Arial'; context.fillText('PARÓDIA • SEM VALOR OFICIAL • carta.guigoes.com', 540, 1456);
  context.restore();
}
