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
const floatingCartButton = document.querySelector(".carrinho-flutuante");
const cartCounter = document.querySelector("[data-carrinho-contador]");
const deliveryForm = document.querySelector("#formulario-entrega");
const customerNameInput = document.querySelector("#nome-cliente");
const deliveryAddressInput = document.querySelector("#endereco-entrega");
const paymentSelect = document.querySelector("#forma-pagamento");
const changeField = document.querySelector("[data-campo-troco]");
const changeInput = document.querySelector("#troco");
const scriptUrl =
  document.currentScript?.src ?? new URL("js/", document.baseURI);
const menuDataUrl = new URL("dados.json", scriptUrl);

let cardapio = [];
let carrinho = [];
let restauranteAberto = true;
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
  if (!restauranteAberto) {
    window.alert(
      "O Bistrô está fechado no momento. Não é possível adicionar itens.",
    );
    return;
  }

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
      itemTotal.textContent = priceFormatter.format(
        item.preco * item.quantidade,
      );

      const heading = document.createElement("div");
      heading.className = "carrinho-item-heading";
      heading.append(name, itemTotal);

      const quantityControls = document.createElement("div");
      quantityControls.className = "carrinho-quantidade";
      quantityControls.setAttribute("role", "group");
      quantityControls.setAttribute("aria-label", `Quantidade de ${item.nome}`);

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
      increaseButton.setAttribute(
        "aria-label",
        `Adicionar mais um ${item.nome}`,
      );
      increaseButton.innerHTML =
        '<i class="fas fa-plus" aria-hidden="true"></i>';
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

function atualizarCampoTroco() {
  if (paymentSelect.value === "Dinheiro") {
    changeField.classList.remove("hidden");
    changeInput.disabled = false;
    return;
  }

  changeField.classList.add("hidden");
  changeInput.value = "";
  changeInput.disabled = true;
}

function finalizarPedido(event) {
  event.preventDefault();

  if (carrinho.length === 0) {
    window.alert(
      "Seu carrinho está vazio. Adicione um item antes de finalizar.",
    );
    return;
  }

  const nome = customerNameInput.value.trim();
  const endereco = deliveryAddressInput.value.trim();

  if (!nome || !endereco) {
    window.alert("Preencha o nome e o endereço para continuar com a entrega.");
    (!nome ? customerNameInput : deliveryAddressInput).focus();
    return;
  }

  const itens = agruparItensDoCarrinho();
  const { subtotal, taxaEntrega, total } = calcularValoresDoCarrinho();
  const formaPagamento = paymentSelect.value;
  const valorTroco = Number(changeInput.value);
  const linhasDosItens = itens.map(
    (item) =>
      `- ${item.quantidade}x ${item.nome} — ${priceFormatter.format(item.preco * item.quantidade)}`,
  );
  const linhasDaMensagem = [
    "*Novo Pedido!*",
    `*Nome:* ${nome}`,
    `*Endereço:* ${endereco}`,
    "",
    "*Itens:*",
    ...linhasDosItens,
    "",
    `*Subtotal:* ${priceFormatter.format(subtotal)}`,
    `*Taxa de Entrega:* ${priceFormatter.format(taxaEntrega)}`,
    `*Total:* ${priceFormatter.format(total)}`,
    "",
    `*Pagamento:* ${formaPagamento}`,
  ];

  if (formaPagamento === "Dinheiro" && valorTroco > 0) {
    linhasDaMensagem.push(`*Troco para:* ${priceFormatter.format(valorTroco)}`);
  }

  const mensagem = linhasDaMensagem.join("\n");
  const numeroWhatsapp = "SEU_NUMERO";
  const url = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

function createMenuCard(item) {
  const card = document.createElement("article");
  card.className = "menu-item";

  const image = document.createElement("img");
  image.src = item.imagem;
  image.alt = item.nome;

  const info = document.createElement("div");
  info.className = "item-info";

  const title = document.createElement("h4");
  title.textContent = item.nome;

  const description = document.createElement("p");
  description.textContent = item.descricao;

  const footer = document.createElement("div");
  footer.className = "item-footer";

  const price = document.createElement("span");
  price.className = "price";
  price.textContent = priceFormatter.format(item.preco);

  const orderButton = document.createElement("button");
  orderButton.type = "button";

  if (item.turno.includes(turnoAtual)) {
    orderButton.className = "btn-cart";
    orderButton.dataset.itemId = item.id;
    orderButton.setAttribute(
      "aria-label",
      `Adicionar ${item.nome} ao carrinho`,
    );
    orderButton.innerHTML =
      '<i class="fas fa-plus" aria-hidden="true"></i><span>Adicionar ao Carrinho</span><span class="item-quantity" aria-hidden="true" hidden>0</span>';
    orderButton.setAttribute("onclick", `adicionarAoCarrinho(${item.id})`);
  } else {
    orderButton.className = "btn-cart btn-indisponivel";
    orderButton.disabled = true;
    orderButton.setAttribute("aria-label", `${item.nome} indisponível agora`);
    orderButton.textContent = "Indisponível agora";
  }

  footer.append(price, orderButton);
  info.append(title, description, footer);
  card.append(image, info);
  return card;
}

function renderMenu(cardapio, turno) {
  const grid = document.querySelector(`[data-menu-grid="${turno}"]`);
  const itensDoCardapio = cardapio.filter(
    (item) => !item.pratoDoDia && item.turno.includes(turno),
  );

  grid.replaceChildren();

  if (itensDoCardapio.length === 0) {
    const feedback = document.createElement("p");
    feedback.className = "menu-feedback";
    feedback.textContent = "Ainda não há opções disponíveis para este período.";
    grid.append(feedback);
    return;
  }

  itensDoCardapio.forEach((item) => grid.append(createMenuCard(item)));
}

function renderChefSuggestion(cardapio) {
  const sugestao = cardapio.find((prato) => prato.pratoDoDia);
  heroSuggestion.replaceChildren();

  if (!sugestao) return;

  const disponivelNoTurnoAtual = sugestao.turno.includes(turnoAtual);
  const classeBotao = disponivelNoTurnoAtual
    ? "btn-cart"
    : "btn-cart btn-indisponivel";
  const atributoDisabled = disponivelNoTurnoAtual ? "" : "disabled";
  const textoBotao = disponivelNoTurnoAtual
    ? "Adicionar ao Carrinho"
    : "Indisponível agora";

  const text = document.createElement("div");
  text.className = "suggestion-text";
  text.innerHTML = `
        <span class="tag-destaque">⭐ Sugestão do Chef</span>
        <h2></h2>
        <p></p>
        <p class="price-hero"></p>
        <button type="button" class="${classeBotao}" ${atributoDisabled} aria-label="${disponivelNoTurnoAtual ? "Adicionar a sugestão do chef ao carrinho" : "Sugestão do chef indisponível agora"}">
            <i class="fas fa-plus" aria-hidden="true"></i>
            <span>${textoBotao}</span>
            <span class="item-quantity" aria-hidden="true" hidden>0</span>
        </button>
    `;
  text.querySelector("h2").textContent = sugestao.nome;
  text.querySelector("p:not(.price-hero)").textContent = sugestao.descricao;
  text.querySelector(".price-hero").textContent = priceFormatter.format(
    sugestao.preco,
  );
  const suggestionButton = text.querySelector(".btn-cart");
  if (disponivelNoTurnoAtual) {
    suggestionButton.dataset.itemId = sugestao.id;
    suggestionButton.addEventListener("click", () =>
      adicionarAoCarrinho(sugestao.id),
    );
  }

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

  if (cardapio.length > 0) {
    renderChefSuggestion(cardapio);
    renderMenu(cardapio, "almoco");
    renderMenu(cardapio, "jantar");
  }

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
    const response = await fetch(menuDataUrl);
    if (!response.ok)
      throw new Error(`Erro ao carregar cardápio: ${response.status}`);

    const dados = await response.json();
    cardapio = dados.map((item) => ({
      ...item,
      imagem: new URL(item.imagem, response.url).href,
    }));
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
paymentSelect.addEventListener("change", atualizarCampoTroco);
deliveryForm.addEventListener("submit", finalizarPedido);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") fecharCarrinho();
});

atualizarCampoTroco();
atualizarCarrinho();
loadMenu();
