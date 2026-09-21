(function () {
  'use strict';

  /* ── Menu hamburguer (mobile) ── */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('is-open');
      hamburgerBtn.classList.toggle('is-open', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    /* Fecha o menu ao clicar em qualquer link mobile */
    document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        hamburgerBtn.classList.remove('is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });

    /* Fecha o menu ao clicar fora dele */
    document.addEventListener('click', function (event) {
      const clickedInside =
        hamburgerBtn.contains(event.target) || mobileMenu.contains(event.target);
      if (!clickedInside && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
        hamburgerBtn.classList.remove('is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Lógica de leitura da planilha será inserida aqui
  // ==========================================
  // LEITURA AUTOMÁTICA DA PLANILHA (TESTE LIVROS)
  // ==========================================

  // ID da planilha tirado do seu link do Google Sheets
  const sheetId = '1Lci5thNILOsNW3ACJjNDC27gdd0NDKR1zMaFjxvV4xS';
  const urlPlanilha = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=tsv`;

  async function carregarCatalogo() {
    try {
      // Busca os dados da planilha
      const resposta = await fetch(urlPlanilha);
      const dados = await resposta.text();

      // Separa os dados por linha
      const linhas = dados.split('\n');

      // Seleciona a div onde os produtos vão aparecer (conforme nosso HTML)
      const grid = document.getElementById('catalogo-grid');

      // Limpa os cards estáticos de exemplo
      if (grid) grid.innerHTML = '';

      // O loop começa no índice 5 porque os dados reais do seu print começam na linha 6 (LIV-001)
      for (let i = 5; i < linhas.length; i++) {
        const colunas = linhas[i].split('\t'); // TSV separa por espaço TAB

        // Se a linha estiver vazia, pula para a próxima
        if (colunas.length < 10 || colunas[0].trim() === '') continue;

        // Mapeando as colunas conforme o seu print:
        const codigo = colunas[0];         // Coluna A (LIV-001)
        const titulo = colunas[1];         // Coluna B (QUATRO AMORES)
        const autor = colunas[2];          // Coluna C (C.S LEWIS)
        const categoria = colunas[3];      // Coluna D (Teologia, Poesia)
        const estoqueAtual = parseInt(colunas[8]); // Coluna I (1)
        const estado = colunas[9];         // Coluna J (Ótimo)
        const imagem = colunas[10].trim(); // Coluna K (Link do postimg)

        // REGRA DE NEGÓCIO: Se o estoque for 0 (vendido), o item não é gerado na tela
        if (estoqueAtual <= 0) continue;

        // Cria o card do produto em HTML
        const cardHTML = `
                <article class="product-card">
                    <div class="product-card__image-wrap">
                        <img src="${imagem}" alt="${titulo}" loading="lazy">
                        <span class="product-card__category">${categoria}</span>
                        <span class="product-card__condition">${estado}</span>
                    </div>
                    <div class="product-card__body">
                        <span class="product-card__code">Cód: #${codigo}</span>
                        <h3 class="product-card__title">${titulo}</h3>
                        <p class="product-card__desc">Autor: ${autor}</p>
                        <div class="product-card__footer">
                            <a href="https://wa.me/5500000000000?text=Olá!%20Tenho%20interesse%20no%20item%20%23${codigo}%20(${titulo})." 
                               target="_blank" class="btn-whatsapp">
                                💬 Quero Comprar
                            </a>
                        </div>
                    </div>
                </article>
            `;

        // Injeta o card na tela
        grid.insertAdjacentHTML('beforeend', cardHTML);
      }
    } catch (erro) {
      console.error("Erro ao carregar a planilha:", erro);
    }
  }

  // Executa a função assim que o site terminar de carregar
  document.addEventListener('DOMContentLoaded', carregarCatalogo);

})();
