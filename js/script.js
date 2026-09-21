const heroSuggestion = document.querySelector("#hero-suggestion");
const menuSections = document.querySelectorAll(".menu-section");
const tabButtons = document.querySelectorAll(".tab-btn");
const cartSidebar = document.querySelector("#carrinho");
const cartOverlay = document.querySelector("[data-carrinho-overlay]");
const cartItems = document.querySelector("#itens-carrinho");
const cartSubtotal = document.querySelector("#subtotal-carrinho");
const deliveryFee = document.querySelector("#taxa-entrega");
const cartTotal = document.querySelector("#total-carrinho");
const closeCartButton = document.querySelector(".carrinho-fechar");
const checkoutButton = document.querySelector(".btn-finalizar-carrinho");

let cardapio = [];
let carrinho = [];
let turnoAtual = "almoco";

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function abrirCarrinho() {
  cartSidebar.classList.add("is-open");
  cartOverlay.classList.add("is-open");
  cartSidebar.setAttribute("aria-hidden", "false");
}

function fecharCarrinho() {
  cartSidebar.classList.remove("is-open");
  cartOverlay.classList.remove("is-open");
  cartSidebar.setAttribute("aria-hidden", "true");
}

function agruparItensDoCarrinho() {
  return carrinho.reduce((itensAgrupados, prato) => {
    const itemExistente = itensAgrupados.find((item) => item.id === prato.id);

    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      itensAgrupados.push({ ...prato, quantidade: 1 });
    }

    return itensAgrupados;
  }, []);
}

function calcularValoresDoCarrinho() {
  const subtotal = carrinho.reduce((soma, prato) => soma + prato.preco, 0);
  const temComidaNormal = carrinho.some(
    (prato) => prato.categoria === "comida_normal",
  );
  const taxaEntrega =
    turnoAtual === "jantar" && temComidaNormal && carrinho.length > 0 ? 3 : 0;

  return { subtotal, taxaEntrega, total: subtotal + taxaEntrega };
}

function adicionarAoCarrinho(id) {
  const prato = cardapio.find((item) => item.id === id);

  if (!prato) {
    console.error(`Prato com o ID ${id} não encontrado.`);
    return;
  }

  carrinho.push(prato);
  atualizarCarrinho();
  abrirCarrinho();
}

function atualizarCarrinho() {
  cartItems.replaceChildren();

  if (carrinho.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "menu-feedback";
    emptyMessage.textContent = "Seu carrinho está vazio.";
    cartItems.append(emptyMessage);
  } else {
    agruparItensDoCarrinho().forEach((item) => {
      const cartItem = document.createElement("article");
      cartItem.className = "carrinho-item";

      const name = document.createElement("strong");
      name.textContent = item.nome;

      const details = document.createElement("span");
      details.textContent = `${item.quantidade}x ${priceFormatter.format(item.preco)}`;

      const itemTotal = document.createElement("span");
      itemTotal.textContent = priceFormatter.format(item.preco * item.quantidade);

      cartItem.append(name, details, itemTotal);
      cartItems.append(cartItem);
    });
  }

  const valores = calcularValoresDoCarrinho();
  cartSubtotal.textContent = priceFormatter.format(valores.subtotal);
  deliveryFee.textContent = priceFormatter.format(valores.taxaEntrega);
  cartTotal.textContent = priceFormatter.format(valores.total);
  checkoutButton.disabled = carrinho.length === 0;
}

function finalizarPedido() {
  if (carrinho.length === 0) return;

  const itens = agruparItensDoCarrinho();
  const { subtotal, taxaEntrega, total } = calcularValoresDoCarrinho();
  const linhasDosItens = itens.map(
    (item) =>
      `- ${item.quantidade}x ${item.nome} — ${priceFormatter.format(item.preco * item.quantidade)}`,
  );
  const mensagem = [
    "Olá! Gostaria de fazer o seguinte pedido:",
    "",
    ...linhasDosItens,
    "",
    `Subtotal: ${priceFormatter.format(subtotal)}`,
    `Taxa de entrega: ${priceFormatter.format(taxaEntrega)}`,
    `Total: ${priceFormatter.format(total)}`,
  ].join("\n");
  const numeroWhatsapp = "SEU_NUMERO";
  const url = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

function createMenuCard(prato) {
  const card = document.createElement("article");
  card.className = "menu-item";

  const image = document.createElement("img");
  image.src = prato.imagem;
  image.alt = prato.nome;

  const info = document.createElement("div");
  info.className = "item-info";

  const title = document.createElement("h4");
  title.textContent = prato.nome;

  const description = document.createElement("p");
  description.textContent = prato.descricao;

  const footer = document.createElement("div");
  footer.className = "item-footer";

  const price = document.createElement("span");
  price.className = "price";
  price.textContent = priceFormatter.format(prato.preco);

  const orderButton = document.createElement("button");
  orderButton.className = "btn-cart";
  orderButton.type = "button";
  orderButton.setAttribute(
    "aria-label",
    `Adicionar ${prato.nome} ao carrinho`,
  );
  orderButton.innerHTML =
    '<i class="fas fa-cart-plus" aria-hidden="true"></i><span>Adicionar</span>';
  orderButton.addEventListener("click", () => adicionarAoCarrinho(prato.id));

  footer.append(price, orderButton);
  info.append(title, description, footer);
  card.append(image, info);
  return card;
}

function renderMenu(cardapio, turno) {
  const grid = document.querySelector(`[data-menu-grid="${turno}"]`);
  const pratosDoTurno = cardapio.filter(
    (prato) => !prato.pratoDoDia && prato.turno.includes(turno),
  );

  grid.replaceChildren();

  if (pratosDoTurno.length === 0) {
    const feedback = document.createElement("p");
    feedback.className = "menu-feedback";
    feedback.textContent = "Ainda não há opções disponíveis para este período.";
    grid.append(feedback);
    return;
  }

  pratosDoTurno.forEach((prato) => grid.append(createMenuCard(prato)));
}

function renderChefSuggestion(cardapio) {
  const sugestao = cardapio.find((prato) => prato.pratoDoDia);
  heroSuggestion.replaceChildren();

  if (!sugestao) return;

  const text = document.createElement("div");
  text.className = "suggestion-text";
  text.innerHTML = `
        <span class="tag-destaque">⭐ Sugestão do Chef</span>
        <h2></h2>
        <p></p>
        <p class="price-hero"></p>
        <button type="button" class="btn-cart" aria-label="Adicionar a sugestão do chef ao carrinho">
            <i class="fas fa-cart-plus" aria-hidden="true"></i>
            <span>Adicionar ao Carrinho</span>
        </button>
    `;
  text.querySelector("h2").textContent = sugestao.nome;
  text.querySelector("p:not(.price-hero)").textContent = sugestao.descricao;
  text.querySelector(".price-hero").textContent = priceFormatter.format(
    sugestao.preco,
  );
  text
    .querySelector(".btn-cart")
    .addEventListener("click", () => adicionarAoCarrinho(sugestao.id));

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "suggestion-img";
  const image = document.createElement("img");
  image.src = sugestao.imagem;
  image.alt = sugestao.nome;
  imageWrapper.append(image);

  heroSuggestion.append(text, imageWrapper);
}

function showMenu(turno) {
  turnoAtual = turno;

  menuSections.forEach((section) => {
    section.classList.toggle("hidden-section", section.id !== turno);
  });

  tabButtons.forEach((button) => {
    const isActive = button.dataset.turno === turno;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  atualizarCarrinho();
}

function showLoadError() {
  heroSuggestion.replaceChildren();
  document.querySelectorAll(".menu-grid").forEach((grid) => {
    grid.innerHTML =
      '<p class="menu-feedback">Não foi possível carregar o cardápio. Tente novamente em instantes.</p>';
  });
}

async function loadMenu() {
  try {
    const response = await fetch("js/dados.json");
    if (!response.ok)
      throw new Error(`Erro ao carregar cardápio: ${response.status}`);

    cardapio = await response.json();
    renderChefSuggestion(cardapio);
    renderMenu(cardapio, "almoco");
    renderMenu(cardapio, "jantar");
  } catch (error) {
    console.error(error);
    showLoadError();
  }
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => showMenu(button.dataset.turno));
});

closeCartButton.addEventListener("click", fecharCarrinho);
cartOverlay.addEventListener("click", fecharCarrinho);
checkoutButton.addEventListener("click", finalizarPedido);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") fecharCarrinho();
});

atualizarCarrinho();
loadMenu();
