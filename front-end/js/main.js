// Lógica do Menu Hamburguer Mobile
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      hamburgerBtn.classList.toggle('is-open', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });
  }

  // Leitura Automática da Planilha (Teste)
  carregarCatalogo();
});

async function carregarCatalogo() {
  // ID da folha de cálculo
  const sheetId = '1Lci5thNILOsNW3ACJjNDC27gdd0NDKR1zMaFjxvV4xS';

  // Rota oficial do Google para contornar o bloqueio CORS
  const urlPlanilha = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

  try {
    const resposta = await fetch(urlPlanilha);
    if (!resposta.ok) throw new Error('Falha ao aceder à folha de cálculo');

    const texto = await resposta.text();

    // O Google envia o JSON envolvido numa função de texto. Precisamos limpar isso.
    const jsonString = texto.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\);/)[1];
    const dados = JSON.parse(jsonString);

    const grid = document.getElementById('catalogo-grid');
    if (!grid) return;

    // Limpa os cards estáticos de exemplo antigos do HTML
    grid.innerHTML = '';

    const linhas = dados.table.rows;

    // Percorre todas as linhas da folha de cálculo
    for (let i = 0; i < linhas.length; i++) {
      const colunas = linhas[i].c;

      // Se a linha for nula, não tiver as 11 colunas ou não tiver código, ignora
      if (!colunas || colunas.length < 11 || !colunas[0] || !colunas[0].v) continue;

      const codigo = colunas[0].v.toString().trim();

      // Ignora a linha de cabeçalho da tabela
      if (codigo.toLowerCase() === 'código') continue;

      // Extrai os valores de forma segura (verifica se a célula não está vazia)
      const titulo = colunas[1] && colunas[1].v ? colunas[1].v.toString().trim() : '';
      const autor = colunas[2] && colunas[2].v ? colunas[2].v.toString().trim() : '';
      const categoria = colunas[3] && colunas[3].v ? colunas[3].v.toString().trim() : '';
      const estoqueAtual = colunas[8] && colunas[8].v !== null ? Number(colunas[8].v) : 0;
      const estado = colunas[9] && colunas[9].v ? colunas[9].v.toString().trim() : '';
      const imagem = colunas[10] && colunas[10].v ? colunas[10].v.toString().trim() : '';

      // Se o stock for 0 ou menor, o item não é renderizado no site
      if (isNaN(estoqueAtual) || estoqueAtual <= 0) continue;

      // Cria o card dinâmico em HTML
      const cardHTML = `
                <article class="product-card">
                    <div class="product-card__image-wrap">
                        ${imagem ? `<img src="${imagem}" alt="${titulo}" loading="lazy">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;">📦</div>`}
                        <span class="product-card__category">${categoria}</span>
                        <span class="product-card__condition">${estado}</span>
                    </div>
                    <div class="product-card__body">
                        <span class="product-card__code">Cód: #${codigo}</span>
                        <h3 class="product-card__title">${titulo}</h3>
                        <p class="product-card__desc">Autor: ${autor}</p>
                        <div class="product-card__footer">
                            <a href="https://wa.me/+5511973812346?text=Olá!%20Tenho%20interesse%20no%20item%20%23${codigo}%20(${encodeURIComponent(titulo)})." 
                               target="_blank" class="btn-whatsapp">
                                💬 Quero Comprar
                            </a>
                        </div>
                    </div>
                </article>
            `;

      // Injeta o card na grelha da página
      grid.insertAdjacentHTML('beforeend', cardHTML);
    }
  } catch (erro) {
    console.error("Erro ao carregar os dados da folha de cálculo:", erro);
  }
}