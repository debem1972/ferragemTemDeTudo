import { getProducts } from '../services/products.js';

const state = {
  products: [],
  filteredProducts: [],
  activeFilter: 'all',
  cart: [],
  focusedProduct: null,
};

const searchForm = document.querySelector('.search');
const offersGrid = document.querySelector('.offers__grid');
const productGrid = document.querySelector('[data-product-grid]');
const productCount = document.querySelector('[data-product-count]');
const filterButtons = document.querySelectorAll('[data-filter]');
const cartList = document.querySelector('[data-cart-list]');
const cartCounts = document.querySelectorAll('[data-cart-count]');
const cartTotal = document.querySelector('[data-cart-total]');
const clearCartButton = document.querySelector('[data-clear-cart]');
const cartPanel = document.querySelector('[data-cart-panel]');
const cartOpenButtons = document.querySelectorAll('[data-cart-open]');
const cartCloseButtons = document.querySelectorAll('[data-cart-close]');
const accountCtaButton = document.querySelector('[data-account-cta]');
const focusName = document.querySelector('[data-product-name]');
const focusBadge = document.querySelector('[data-product-badge]');
const focusDescription = document.querySelector('[data-product-description]');
const focusPrice = document.querySelector('[data-product-price]');
const focusSpecs = document.querySelector('[data-product-specs]');
const focusAddButton = document.querySelector('[data-focus-add]');
const focusMedia = document.querySelector('.product-focus__media');
const siteHeader = document.querySelector('.header');

function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function getCartSubtotal() {
  return state.cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
}

function renderFocusedProduct(product) {
  if (!product || !focusName || !focusBadge || !focusDescription || !focusPrice || !focusSpecs) {
    return;
  }

  state.focusedProduct = product;
  focusBadge.textContent = product.badge;
  focusName.textContent = product.nome;
  focusDescription.textContent = product.descricao;
  focusPrice.textContent = formatPrice(product.preco);
  focusMedia?.setAttribute('data-visual', product.visual || 'tool');
  focusSpecs.innerHTML = `
    <li>Categoria: ${product.categoriaLabel || product.categoria}</li>
    <li>Entrega estimada: ${product.entrega}</li>
    <li>Estoque: ${product.estoqueLabel}</li>
  `;
}

function renderProducts(products) {
  if (!productGrid) {
    return;
  }

  if (!products.length) {
    productGrid.innerHTML =
      '<p class="empty-state">Nenhum produto encontrado para este filtro.</p>';

    if (productCount) {
      productCount.textContent = '0 produtos em destaque';
    }

    return;
  }

  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="catalog-card reveal is-visible">
          <div class="catalog-card__media catalog-card__media--${product.visual || 'tool'}" aria-hidden="true">
            <span>${product.categoriaLabel || product.categoria}</span>
          </div>
          <span class="product-card__tag">${product.badge}</span>
          <h3>${product.nome}</h3>
          <p>${product.descricao}</p>
          <div class="catalog-card__footer">
            <strong>${formatPrice(product.preco)}</strong>
            <div class="catalog-card__actions">
              <button class="button button--secondary catalog-card__button" type="button" data-focus-product="${product.id}">
                Ver produto
              </button>
              <button class="button button--primary catalog-card__button" type="button" data-add-to-cart="${product.id}">
                Comprar
              </button>
            </div>
          </div>
        </article>
      `,
    )
    .join('');

  if (productCount) {
    productCount.textContent = `${products.length} produtos em destaque`;
  }
}

function syncCategoryNavOffset() {
  if (!siteHeader) {
    return;
  }

  if (window.innerWidth <= 720) {
    document.documentElement.style.removeProperty('--category-nav-offset');
    return;
  }

  const headerHeight = Math.ceil(siteHeader.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--category-nav-offset', `${headerHeight}px`);
}

function openCart() {
  if (!cartPanel) {
    return;
  }

  cartPanel.classList.add('is-open');
  cartPanel.setAttribute('aria-hidden', 'false');
  document.body.classList.add('has-cart-open');
}

function closeCart() {
  if (!cartPanel) {
    return;
  }

  cartPanel.classList.remove('is-open');
  cartPanel.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('has-cart-open');
}

function renderCart() {
  if (!cartList || !cartCounts.length || !cartTotal) {
    return;
  }

  if (!state.cart.length) {
    cartList.innerHTML = '<p class="empty-state">Seu carrinho ainda esta vazio.</p>';
    cartCounts.forEach((element) => {
      element.textContent = '0';
    });
    cartTotal.textContent = formatPrice(0);
    return;
  }

  cartList.innerHTML = state.cart
    .map(
      (item) => `
        <article class="cart-item">
          <div>
            <h4>${item.nome}</h4>
            <p>${item.quantidade} unidade(s)</p>
          </div>
          <div class="cart-item__meta">
            <strong>${formatPrice(item.preco * item.quantidade)}</strong>
            <button class="text-button" type="button" data-remove-from-cart="${item.id}">
              Remover
            </button>
          </div>
        </article>
      `,
    )
    .join('');

  const totalItems = state.cart.reduce((sum, item) => sum + item.quantidade, 0);
  const totalPrice = getCartSubtotal();

  cartCounts.forEach((element) => {
    element.textContent = String(totalItems);
  });
  cartTotal.textContent = formatPrice(totalPrice);
}

function applyFilter(filter) {
  state.activeFilter = filter;
  state.filteredProducts =
    filter === 'all'
      ? state.products
      : state.products.filter((product) => product.categoria === filter);

  filterButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.filter === filter);
  });

  renderProducts(state.filteredProducts);
}

function addToCart(productId) {
  const product = state.products.find((item) => item.id === Number(productId));

  if (!product) {
    return;
  }

  const existingProduct = state.cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantidade += 1;
  } else {
    state.cart.push({ ...product, quantidade: 1 });
  }

  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== Number(productId));
  renderCart();
}

async function initializeCatalog() {
  state.products = await getProducts();
  renderFocusedProduct(state.products[0]);
  applyFilter('all');
  renderCart();
}

if (searchForm) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(searchForm);
    const query = String(formData.get('search-input') || '')
      .trim()
      .toLowerCase();

    if (!query) {
      applyFilter(state.activeFilter);
      document.querySelector('#catalogo')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    state.filteredProducts = state.products.filter((product) => {
      return (
        product.nome.toLowerCase().includes(query) ||
        product.descricao.toLowerCase().includes(query) ||
        product.categoria.toLowerCase().includes(query)
      );
    });

    renderProducts(state.filteredProducts);
    document.querySelector('#catalogo')?.scrollIntoView({ behavior: 'smooth' });
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    applyFilter(button.dataset.filter || 'all');
  });
});

productGrid?.addEventListener('click', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const addButton = target.closest('[data-add-to-cart]');
  const focusButton = target.closest('[data-focus-product]');

  if (focusButton instanceof HTMLElement) {
    const product = state.products.find((item) => item.id === Number(focusButton.dataset.focusProduct));
    renderFocusedProduct(product);
    document.querySelector('#produto')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (addButton instanceof HTMLElement) {
    addToCart(addButton.dataset.addToCart);
  }
});

offersGrid?.addEventListener('click', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const addButton = target.closest('[data-add-to-cart]');
  const focusButton = target.closest('[data-focus-product]');

  if (focusButton instanceof HTMLElement) {
    const product = state.products.find((item) => item.id === Number(focusButton.dataset.focusProduct));
    renderFocusedProduct(product);
    document.querySelector('#produto')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (addButton instanceof HTMLElement) {
    addToCart(addButton.dataset.addToCart);
  }
});

cartList?.addEventListener('click', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const removeButton = target.closest('[data-remove-from-cart]');

  if (removeButton instanceof HTMLElement) {
    removeFromCart(removeButton.dataset.removeFromCart);
  }
});

focusAddButton?.addEventListener('click', () => {
  if (!state.focusedProduct) {
    return;
  }

  addToCart(state.focusedProduct.id);
});

clearCartButton?.addEventListener('click', () => {
  state.cart = [];
  renderCart();
});

cartOpenButtons.forEach((button) => {
  button.addEventListener('click', openCart);
});

cartCloseButtons.forEach((button) => {
  button.addEventListener('click', closeCart);
});

accountCtaButton?.addEventListener('click', () => {
  alert('Na proxima etapa vamos criar login/cadastro e uma pagina propria de checkout.');
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeCart();
  }
});

const revealElements = document.querySelectorAll(
  '.hero__panel, .hero__visual, .category-card, .product-card, .security-card, .reason-card, .journey-step',
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 },
);

revealElements.forEach((element, index) => {
  element.style.setProperty('--reveal-delay', `${index * 70}ms`);
  element.classList.add('reveal');
  observer.observe(element);
});

syncCategoryNavOffset();
window.addEventListener('load', syncCategoryNavOffset);
window.addEventListener('resize', syncCategoryNavOffset);

initializeCatalog();
