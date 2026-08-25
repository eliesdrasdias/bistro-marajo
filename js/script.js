const heroSuggestion = document.querySelector('#hero-suggestion');
const menuSections = document.querySelectorAll('.menu-section');
const tabButtons = document.querySelectorAll('.tab-btn');
const priceFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

function createMenuCard(prato) {
    const card = document.createElement('article');
    card.className = 'menu-item';

    const image = document.createElement('img');
    image.src = prato.imagem;
    image.alt = prato.nome;

    const info = document.createElement('div');
    info.className = 'item-info';

    const title = document.createElement('h4');
    title.textContent = prato.nome;

    const description = document.createElement('p');
    description.textContent = prato.descricao;

    const footer = document.createElement('div');
    footer.className = 'item-footer';

    const price = document.createElement('span');
    price.className = 'price';
    price.textContent = priceFormatter.format(prato.preco);

    const orderButton = document.createElement('button');
    orderButton.className = 'btn-cart';
    orderButton.type = 'button';
    orderButton.setAttribute('aria-label', `Pedir ${prato.nome} pelo WhatsApp`);
    orderButton.innerHTML = '<i class="fab fa-whatsapp" aria-hidden="true"></i>';

    footer.append(price, orderButton);
    info.append(title, description, footer);
    card.append(image, info);
    return card;
}

function renderMenu(cardapio, turno) {
    const grid = document.querySelector(`[data-menu-grid="${turno}"]`);
    const pratosDoTurno = cardapio.filter((prato) => prato.turno.includes(turno));

    grid.replaceChildren();

    if (pratosDoTurno.length === 0) {
        const feedback = document.createElement('p');
        feedback.className = 'menu-feedback';
        feedback.textContent = 'Ainda não há opções disponíveis para este período.';
        grid.append(feedback);
        return;
    }

    pratosDoTurno.forEach((prato) => grid.append(createMenuCard(prato)));
}

function renderChefSuggestion(cardapio) {
    const sugestao = cardapio.find((prato) => prato.pratoDoDia);
    heroSuggestion.replaceChildren();

    if (!sugestao) return;

    const text = document.createElement('div');
    text.className = 'suggestion-text';
    text.innerHTML = `
        <span class="tag-destaque">⭐ Sugestão do Chef</span>
        <h2></h2>
        <p></p>
        <p class="price-hero"></p>
        <a href="#" class="btn-cta" aria-label="Pedir a sugestão do chef pelo WhatsApp">
            <i class="fab fa-whatsapp" aria-hidden="true"></i> Pedir Agora
        </a>
    `;
    text.querySelector('h2').textContent = sugestao.nome;
    text.querySelector('p:not(.price-hero)').textContent = sugestao.descricao;
    text.querySelector('.price-hero').textContent = priceFormatter.format(sugestao.preco);

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'suggestion-img';
    const image = document.createElement('img');
    image.src = sugestao.imagem;
    image.alt = sugestao.nome;
    imageWrapper.append(image);

    heroSuggestion.append(text, imageWrapper);
}

function showMenu(turno) {
    menuSections.forEach((section) => {
        section.classList.toggle('hidden-section', section.id !== turno);
    });

    tabButtons.forEach((button) => {
        const isActive = button.dataset.turno === turno;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', String(isActive));
    });
}

function showLoadError() {
    heroSuggestion.replaceChildren();
    document.querySelectorAll('.menu-grid').forEach((grid) => {
        grid.innerHTML = '<p class="menu-feedback">Não foi possível carregar o cardápio. Tente novamente em instantes.</p>';
    });
}

async function loadMenu() {
    try {
        const response = await fetch('js/dados.json');
        if (!response.ok) throw new Error(`Erro ao carregar cardápio: ${response.status}`);

        const cardapio = await response.json();
        renderChefSuggestion(cardapio);
        renderMenu(cardapio, 'almoco');
        renderMenu(cardapio, 'jantar');
    } catch (error) {
        console.error(error);
        showLoadError();
    }
}

tabButtons.forEach((button) => {
    button.addEventListener('click', () => showMenu(button.dataset.turno));
});

loadMenu();
