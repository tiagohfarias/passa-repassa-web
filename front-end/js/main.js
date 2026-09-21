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
    // ID da planilha de teste
    const sheetId = '1Lci5thNILOsNW3ACJjNDC27gdd0NDKR1zMaFjxvV4xS';
    const urlPlanilha = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=tsv`;

    try {
        const resposta = await fetch(urlPlanilha);
        if (!resposta.ok) throw new Error('Falha ao buscar dados da planilha');

        const dados = await resposta.text();
        const linhas = dados.split('\n');
        const grid = document.getElementById('catalogo-grid');

        if (!grid) return;

        // Limpa os cards estáticos de exemplo antigos do HTML
        grid.innerHTML = '';

        // O loop começa na linha 6 (índice 5) onde começam os produtos reais
        for (let i = 5; i < linhas.length; i++) {
            const colunas = linhas[i].split('\t');

            // Ignora linhas sem dados mínimos
            if (colunas.length < 10 || !colunas[0] || colunas[0].trim() === '') continue;

            const codigo = colunas[0].trim();          // Coluna A (Cód)
            const titulo = colunas[1].trim();          // Coluna B (Nome/Item)
            const autor = colunas[2].trim();           // Coluna C (Autor)
            const categoria = colunas[3].trim();       // Coluna D (Categoria)
            const estoqueAtual = parseInt(colunas[8]); // Coluna I (Estoque)
            const estado = colunas[9].trim();          // Coluna J (Estado)
            const imagem = colunas[10] ? colunas[10].trim() : ''; // Coluna K (Imagem URL)

            // Se o estoque for 0 ou menor, não mostra no site
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
                            <a href="https://wa.me/5500000000000?text=Olá!%20Tenho%20interesse%20no%20item%20%23${codigo}%20(${encodeURIComponent(titulo)})."
                               target="_blank" class="btn-whatsapp">
                                💬 Quero Comprar
                            </a>
                        </div>
                    </div>
                </article>
            `;

            grid.insertAdjacentHTML('beforeend', cardHTML);
        }
    } catch (erro) {
        console.error("Erro ao carregar os dados da planilha:", erro);
    }
}
