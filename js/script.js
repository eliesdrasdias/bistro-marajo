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
const floatingCartButton = document.querySelector(".carrinho-flutuante");
const cartCounter = document.querySelector("[data-carrinho-contador]");

let cardapio = [];
let carrinho = [];
let turnoAtual = "almoco";
let elementoFocadoAntesDoCarrinho = null;

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function abrirCarrinho() {
  elementoFocadoAntesDoCarrinho = document.activeElement;
  cartSidebar.classList.add("is-open");
  cartOverlay.classList.add("is-open");
  cartSidebar.setAttribute("aria-hidden", "false");
  floatingCartButton.setAttribute("aria-expanded", "true");
  document.body.classList.add("carrinho-aberto");
  closeCartButton.focus();
}

function fecharCarrinho() {
  if (!cartSidebar.classList.contains("is-open")) return;

  cartSidebar.classList.remove("is-open");
  cartOverlay.classList.remove("is-open");
  cartSidebar.setAttribute("aria-hidden", "true");
  floatingCartButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("carrinho-aberto");

  if (elementoFocadoAntesDoCarrinho instanceof HTMLElement) {
    elementoFocadoAntesDoCarrinho.focus();
  }

  elementoFocadoAntesDoCarrinho = null;
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
  destacarAdicao(id);
}

function alterarQuantidade(id, incremento) {
  if (incremento > 0) {
    adicionarAoCarrinho(id);
    return;
  }

  const indice = carrinho.findIndex((item) => item.id === id);
  if (indice === -1) return;

  carrinho.splice(indice, 1);
  atualizarCarrinho();
}

function quantidadeDoItem(id) {
  return carrinho.filter((item) => item.id === id).length;
}

function destacarAdicao(id) {
  document.querySelectorAll(`[data-item-id="${id}"]`).forEach((button) => {
    button.classList.remove("item-adicionado");
    window.requestAnimationFrame(() => button.classList.add("item-adicionado"));
  });
}

function atualizarContadoresDoMenu() {
  document.querySelectorAll("[data-item-id]").forEach((button) => {
    const id = Number(button.dataset.itemId);
    const quantidade = quantidadeDoItem(id);
    const prato = cardapio.find((item) => item.id === id);
    const counter = button.querySelector(".item-quantity");

    if (counter) {
      counter.textContent = quantidade;
      counter.hidden = quantidade === 0;
    }

    button.classList.toggle("tem-itens", quantidade > 0);
    button.setAttribute(
      "aria-label",
      quantidade > 0
        ? `Adicionar mais um ${prato?.nome ?? "item"}. ${quantidade} no carrinho`
        : `Adicionar ${prato?.nome ?? "item"} ao carrinho`,
    );
  });
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

      const itemTotal = document.createElement("span");
      itemTotal.className = "carrinho-item-total";
      itemTotal.textContent = priceFormatter.format(item.preco * item.quantidade);

      const heading = document.createElement("div");
      heading.className = "carrinho-item-heading";
      heading.append(name, itemTotal);

      const quantityControls = document.createElement("div");
      quantityControls.className = "carrinho-quantidade";
      quantityControls.setAttribute("role", "group");
      quantityControls.setAttribute(
        "aria-label",
        `Quantidade de ${item.nome}`,
      );

      const decreaseButton = document.createElement("button");
      decreaseButton.type = "button";
      decreaseButton.setAttribute("aria-label", `Remover um ${item.nome}`);
      decreaseButton.innerHTML =
        item.quantidade === 1
          ? '<i class="fas fa-trash-alt" aria-hidden="true"></i>'
          : '<i class="fas fa-minus" aria-hidden="true"></i>';
      decreaseButton.addEventListener("click", () =>
        alterarQuantidade(item.id, -1),
      );

      const quantity = document.createElement("span");
      quantity.textContent = item.quantidade;
      quantity.setAttribute("aria-live", "polite");

      const increaseButton = document.createElement("button");
      increaseButton.type = "button";
      increaseButton.setAttribute("aria-label", `Adicionar mais um ${item.nome}`);
      increaseButton.innerHTML = '<i class="fas fa-plus" aria-hidden="true"></i>';
      increaseButton.addEventListener("click", () =>
        alterarQuantidade(item.id, 1),
      );

      quantityControls.append(decreaseButton, quantity, increaseButton);
      cartItem.append(heading, quantityControls);
      cartItems.append(cartItem);
    });
  }

  const valores = calcularValoresDoCarrinho();
  cartSubtotal.textContent = priceFormatter.format(valores.subtotal);
  deliveryFee.textContent = priceFormatter.format(valores.taxaEntrega);
  cartTotal.textContent = priceFormatter.format(valores.total);
  checkoutButton.disabled = carrinho.length === 0;
  cartCounter.textContent = carrinho.length;
  cartCounter.hidden = carrinho.length === 0;
  floatingCartButton.setAttribute(
    "aria-label",
    carrinho.length === 0
      ? "Abrir carrinho. Nenhum item adicionado"
      : `Abrir carrinho. ${carrinho.length} ${carrinho.length === 1 ? "item" : "itens"} adicionado${carrinho.length === 1 ? "" : "s"}`,
  );
  atualizarContadoresDoMenu();
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
  orderButton.dataset.itemId = prato.id;
  orderButton.setAttribute(
    "aria-label",
    `Adicionar ${prato.nome} ao carrinho`,
  );
  orderButton.innerHTML =
    '<i class="fas fa-plus" aria-hidden="true"></i><span>Adicionar</span><span class="item-quantity" aria-hidden="true" hidden>0</span>';
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
            <i class="fas fa-plus" aria-hidden="true"></i>
            <span>Adicionar ao Carrinho</span>
            <span class="item-quantity" aria-hidden="true" hidden>0</span>
        </button>
    `;
  text.querySelector("h2").textContent = sugestao.nome;
  text.querySelector("p:not(.price-hero)").textContent = sugestao.descricao;
  text.querySelector(".price-hero").textContent = priceFormatter.format(
    sugestao.preco,
  );
  text.querySelector(".btn-cart").dataset.itemId = sugestao.id;
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
floatingCartButton.addEventListener("click", abrirCarrinho);
checkoutButton.addEventListener("click", finalizarPedido);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") fecharCarrinho();
});

atualizarCarrinho();
loadMenu();
