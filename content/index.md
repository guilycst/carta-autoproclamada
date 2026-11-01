---
title: Vossa Excelência, Presidente. Gere sua carta de autoproclamação.
description: Crie sua carta fictícia de autoproclamação à Presidência do Brasil e baixe em PNG ou PDF. Paródia política, sem valor oficial.
language: pt-BR
structured_data:
  '@context': https://schema.org
  '@type': WebApplication
  '@id': https://carta.guigoes.com/#generator
  url: https://carta.guigoes.com/
  name: Carta
  description: Gerador gratuito de cartas fictícias de autoproclamação à Presidência do Brasil. Uma paródia política, sem valor oficial, para personalizar e baixar em PNG ou PDF.
  applicationCategory: EntertainmentApplication
  applicationSubCategory: Gerador de cartas de paródia
  genre: Paródia política
  inLanguage: pt-BR
  isAccessibleForFree: true
  browserRequirements: Requer navegador com JavaScript e suporte a Canvas.
  image: https://carta.guigoes.com/assets/social-parodia.jpg
  mainEntityOfPage: https://carta.guigoes.com/
  featureList:
    - Personalização de nome, título e local de governo fictício
    - Prévia da carta no navegador
    - Exportação em PNG e PDF de uma página A4
---

<div class="carta-app">
  <header class="masthead"><div class="portal-brand"><img id="national-emblem" src="./assets/brasao-parodia.png" alt="Brasão paródico da República Autoproclamada do Brazil" width="64" height="64"><a class="brand" href="/" aria-label="Carta, início">carta</a></div><a class="parody-label" href="https://guigoes.com">Uma paródia do Guigoes</a></header>
  <div class="workspace">
    <section class="editor" aria-labelledby="page-title">
      <h1 id="page-title">Vossa Excelência,<br>Presidente.</h1>
      <p class="intro">Não ganhou eleição? Não disputou?<br>Uma carta resolve.</p>
      <form id="letter-form">
        <div class="field"><label for="president-name">Qual é seu nome?</label><input id="president-name" name="name" placeholder="Nome de quem vai assumir" maxlength="80" autocomplete="name" required aria-describedby="name-help"><p id="name-help" class="hint">É o único requisito para tomar posse aqui.</p></div>
        <div class="field"><label for="president-title">Como devemos chamar você?</label><select id="president-title" name="title"><option value="presidente">Presidente</option><option value="presidenta">Presidenta</option></select></div>
        <div class="field"><label for="exile-location">De onde vai governar?</label><input id="exile-location" name="location" placeholder="Miami, sofá da sala, casa da sogra…" maxlength="60" value="sofá da sala"><p class="hint">O exílio pode ser bem perto da geladeira.</p></div>
      </form>
    </section>
    <section class="preview" aria-labelledby="preview-title">
      <div class="preview-heading"><h2 id="preview-title">Seu primeiro ato de governo</h2><span>Uma página. Poder ilimitado.*</span></div>
      <div class="paper"><canvas id="letter-preview" width="2160" height="3056" role="img" aria-label="Prévia da sua carta de autoproclamação. Texto completo disponível abaixo."></canvas></div>
      <p class="preview-note">* Limitado à sua imaginação.</p>
      <details class="transcript"><summary>Ler carta como texto</summary><div id="letter-transcript"></div></details>
    </section>
    <div class="export-controls">
      <div class="actions"><button type="submit" id="download-png" form="letter-form">Baixar PNG</button><button type="button" id="download-pdf" form="letter-form" class="secondary">Baixar PDF</button><button type="button" id="share-letter" form="letter-form" class="secondary" hidden>Compartilhar</button></div>
      <p id="export-status" role="status" aria-live="polite" class="status"></p>
      <p class="privacy">Seus dados ficam neste navegador. A faixa presidencial fica por sua conta.</p>
      <details class="context"><summary>De onde saiu essa ideia?</summary><p>Em 28 de outubro de 2026, após perder a eleição e deixar o Brasil, Flávio Bolsonaro divulgou uma carta na qual se declarou presidente. Depois mudou o texto. Aqui, todo mundo pode fazer sua própria autoproclamação.</p><p>Esta é uma paródia com texto próprio, sem valor oficial. Contexto na <a href="https://agenciabrasil.ebc.com.br/politica/noticia/2026-10/em-carta-golpista-flavio-agradece-milei-e-trump-por-apoio-para-fuga" target="_blank" rel="noopener noreferrer">Agência Brasil</a>.</p></details>
    </div>
  </div>
  <footer class="site-footer"><span>Paródia. Nenhum presidente foi empossado na criação deste site.</span><nav aria-label="Links do projeto"><a href="https://github.com/guilycst/carta-autoproclamada">Código-fonte</a><a href="https://guigoes.com">guigoes.com</a></nav></footer>
  <noscript><p class="noscript">Ative o JavaScript para preencher a carta e baixar os arquivos.</p></noscript>
</div>

<script>/* CARTA_BUNDLE */</script>
