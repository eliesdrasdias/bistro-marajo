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