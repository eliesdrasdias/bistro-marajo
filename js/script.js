const container = document.querySelector('.menu-grid');

let htmlDosPratos = '';

cardapio.forEach(function (prato) {

    htmlDosPratos += `
        <article class="menu-item">
            <img src="${prato.imagem}" alt="${prato.nome}">
            
            <div class="item-info">
                <h4>${prato.nome}</h4>
                <p>${prato.descricao}</p>
                
                <div class="item-footer">
                    <span class="price">R$ ${prato.preco.toFixed(2)}</span>
                    <button class="btn-cart"><i class="fab fa-whatsapp"></i></button>
                </div>
            </div>
        </article>
    `;
});

container.innerHTML = htmlDosPratos;

const suggestion = document.querySelector('#hero-suggestion');

let htmlSuggestion = '';

cardapio.find(function (sugestao) {
    if (sugestao.pratoDoDia == true) {
        return htmlSuggestion += `
    <div class="suggestion-text">
                <span class="tag-destaque">⭐ Sugestão do Chef</span>
                <h2>${sugestao.nome}</h2>
                <p>${sugestao.descricao}</p>
                <p class="price-hero">R$${sugestao.preco.toFixed(2)}</p>
                <a href="" class="btn-cta">
                    <!-- adicionar número futuramente https://wa.me/5591999999999?text=Olá, quero pedir a Sugestão do Chef! -->
                    <i class="fab fa-whatsapp"></i> Pedir Agora
                </a>
            </div>
            <div class="suggestion-img">
                <img src="${sugestao.imagem}" alt="${sugestao.nome}">
            </div>
    `
    }
});

suggestion.innerHTML = htmlSuggestion;