import { getOfferProducts } from '../services/products.js';

const state = {
  products: [],
  filteredProducts: [],
  activeFilter: 'all',
  searchQuery: '',
  sortBy: 'discount',
  minPrice: '',
  maxPrice: '',
  favorites: new Set(),
  cart: [],
};

const searchForm = document.querySelector('[data-header-search]');
const headerSearchInput = document.querySelector('#offers-header-search');
const pageSearchInput = document.querySelector('[data-offers-search]');
const sidebarSearchInput = document.querySelector('[data-sidebar-search]');
const filterButtons = document.querySelectorAll('[data-offers-filter]');
const sortSelect = document.querySelector('[data-offers-sort]');
const priceMinInput = document.querySelector('[data-price-min]');
const priceMaxInput = document.querySelector('[data-price-max]');
const clearFiltersButton = document.querySelector('[data-clear-offers-filters]');
const productGrid = document.querySelector('[data-offers-grid]');
const offersCount = document.querySelector('[data-offers-count]');
const cartCounts = document.querySelectorAll('[data-cart-count]');
const cartList = document.querySelector('[data-cart-list]');
const cartTotal = document.querySelector('[data-cart-total]');
const clearCartButton = document.querySelector('[data-clear-cart]');
const cartPanel = document.querySelector('[data-cart-panel]');
const cartOpenButtons = document.querySelectorAll('[data-cart-open]');
const cartCloseButtons = document.querySelectorAll('[data-cart-close]');
const accountCtaButton = document.querySelector('[data-account-cta]');
const backToHome = document.querySelector('.back-to-home');
const backToHomeButton = document.querySelector('[data-back-to-home]');
const topbar = document.querySelector('.topbar');
const siteHeader = document.querySelector('.header');
const categoryNav = document.querySelector('.category-nav');
const categoryNavLinks = document.querySelectorAll('[data-nav-filter]');

function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function getCartSubtotal() {
  return state.cart.reduce((sum, item) => sum + item.precoPromocional * item.quantidade, 0);
}

function sortProducts(products) {
  const sortedProducts = [...products];

  switch (state.sortBy) {
    case 'lowest':
      sortedProducts.sort((a, b) => a.precoPromocional - b.precoPromocional);
      break;
    case 'highest':
      sortedProducts.sort((a, b) => b.precoPromocional - a.precoPromocional);
      break;
    case 'name':
      sortedProducts.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
      break;
    default:
      sortedProducts.sort((a, b) => b.descontoPercentual - a.descontoPercentual);
      break;
  }

  return sortedProducts;
}

function getDisplayProducts() {
  let products = [...state.products];

  if (state.activeFilter !== 'all') {
    products = products.filter((product) => product.categoria === state.activeFilter);
  }

  if (state.searchQuery) {
    products = products.filter((product) => {
      const searchableContent = [
        product.nome,
        product.categoriaLabel,
        product.descricao,
        product.destaque,
      ]
        .join(' ')
        .toLowerCase();

      return searchableContent.includes(state.searchQuery);
    });
  }

  const minPrice = Number(state.minPrice);
  const maxPrice = Number(state.maxPrice);

  if (state.minPrice !== '') {
    products = products.filter((product) => product.precoPromocional >= minPrice);
  }

  if (state.maxPrice !== '') {
    products = products.filter((product) => product.precoPromocional <= maxPrice);
  }

  return sortProducts(products);
}

function renderProducts() {
  if (!productGrid) {
    return;
  }

  state.filteredProducts = getDisplayProducts();

  if (offersCount) {
    offersCount.textContent = `${state.filteredProducts.length} produtos encontrados`;
  }

  if (!state.filteredProducts.length) {
    productGrid.innerHTML = `
      <p class="offers-page-empty">
        Nenhuma oferta encontrada para esse filtro. Tente outra categoria ou refine sua busca.
      </p>
    `;
    return;
  }

  productGrid.innerHTML = state.filteredProducts
    .map((product) => {
      const isFavorite = state.favorites.has(product.id);

      return `
        <article class="offer-card">
          <div class="offer-card__media">
            <img src="${product.imagem}" alt="${product.nome}" loading="lazy" />
            <button
              class="offer-card__favorite${isFavorite ? ' is-active' : ''}"
              type="button"
              aria-label="${isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}"
              data-favorite-product="${product.id}"
            >
              <i class="bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}"></i>
            </button>
          </div>

          <div class="offer-card__body">
            <p class="offer-card__category">${product.categoriaLabel}</p>
            <h2 class="offer-card__title">${product.nome}</h2>

            <div class="offer-card__meta">
              <span class="offer-card__badge">${product.destaque}</span>
              <span>-${product.descontoPercentual}%</span>
            </div>

            <p class="offer-card__description">${product.descricao}</p>

            <div class="offer-card__pricing">
              <span class="offer-card__price-old">${formatPrice(product.precoOriginal)}</span>
              <strong class="offer-card__price-new">${formatPrice(product.precoPromocional)}</strong>
              <small>
                A vista no pix ou boleto. Economize ${formatPrice(product.economia)} nesta campanha.
              </small>
            </div>

            <div class="offer-card__actions">
              <button class="button button--primary offer-card__cart" type="button" data-add-to-cart="${product.id}">
                <i class="bi bi-cart-plus"></i> Adicionar ao carrinho
              </button>
              <span class="offer-card__stock">${product.estoqueLabel}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderCart() {
  if (!cartList || !cartTotal) {
    return;
  }

  const totalItems = state.cart.reduce((sum, item) => sum + item.quantidade, 0);

  cartCounts.forEach((item) => {
    item.textContent = String(totalItems);
  });

  cartTotal.textContent = formatPrice(getCartSubtotal());

  if (!state.cart.length) {
    cartList.innerHTML = '<p class="empty-state">Seu carrinho de ofertas ainda esta vazio.</p>';
    return;
  }

  cartList.innerHTML = state.cart
    .map(
      (item) => `
        <article class="cart-item">
          <div>
            <strong>${item.nome}</strong>
            <p>${item.quantidade}x ${formatPrice(item.precoPromocional)}</p>
          </div>
          <button class="text-button" type="button" data-remove-from-cart="${item.id}">Remover</button>
        </article>
      `,
    )
    .join('');
}

function addToCart(productId) {
  const product = state.products.find((item) => item.id === Number(productId));

  if (!product) {
    return;
  }

  const existingItem = state.cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantidade += 1;
  } else {
    state.cart.push({
      id: product.id,
      nome: product.nome,
      precoPromocional: product.precoPromocional,
      quantidade: 1,
    });
  }

  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart
    .map((item) => {
      if (item.id !== Number(productId)) {
        return item;
      }

      return {
        ...item,
        quantidade: item.quantidade - 1,
      };
    })
    .filter((item) => item.quantidade > 0);

  renderCart();
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

function syncBackToHomeVisibility() {
  if (!backToHome) {
    return;
  }

  const isVisible = window.scrollY > 320;
  backToHome.classList.toggle('is-visible', isVisible);
  backToHome.setAttribute('aria-hidden', String(!isVisible));
}

function syncLayoutOffsets() {
  if (!siteHeader) {
    return;
  }

  const headerHeight = Math.ceil(siteHeader.getBoundingClientRect().height);
  const categoryNavHeight = categoryNav ? Math.ceil(categoryNav.getBoundingClientRect().height) : 0;
  const topbarHeight = topbar ? Math.ceil(topbar.getBoundingClientRect().height) : 0;

  if (window.innerWidth <= 720) {
    document.documentElement.style.removeProperty('--category-nav-offset');
    document.documentElement.style.setProperty('--fixed-stack-height', `${headerHeight}px`);
    document.documentElement.style.setProperty('--catalog-scroll-offset', `${headerHeight + 20}px`);
    return;
  }

  document.documentElement.style.setProperty('--category-nav-offset', `${headerHeight}px`);
  document.documentElement.style.setProperty(
    '--fixed-stack-height',
    `${topbarHeight + headerHeight + categoryNavHeight}px`,
  );
  document.documentElement.style.setProperty(
    '--catalog-scroll-offset',
    `${headerHeight + categoryNavHeight + 18}px`,
  );
}

function applyFilter(filter) {
  state.activeFilter = filter;

  filterButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.offersFilter === filter);
  });

  renderProducts();
}

function syncSearchInputs(value) {
  if (headerSearchInput) {
    headerSearchInput.value = value;
  }

  if (pageSearchInput) {
    pageSearchInput.value = value;
  }

  if (sidebarSearchInput) {
    sidebarSearchInput.value = value;
  }
}

function clearFilters() {
  state.activeFilter = 'all';
  state.searchQuery = '';
  state.sortBy = 'discount';
  state.minPrice = '';
  state.maxPrice = '';

  filterButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.offersFilter === 'all');
  });

  syncSearchInputs('');

  if (sortSelect) {
    sortSelect.value = 'discount';
  }

  if (priceMinInput) {
    priceMinInput.value = '';
  }

  if (priceMaxInput) {
    priceMaxInput.value = '';
  }

  renderProducts();
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

async function initializeOffersPage() {
  state.products = await getOfferProducts();
  renderProducts();
  renderCart();
}

searchForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const query = headerSearchInput?.value.trim().toLowerCase() || '';
  state.searchQuery = query;
  syncSearchInputs(headerSearchInput?.value || '');

  renderProducts();
  document.querySelector('#promocoes-listagem')?.scrollIntoView({ behavior: 'smooth' });
});

pageSearchInput?.addEventListener('input', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  state.searchQuery = target.value.trim().toLowerCase();
  syncSearchInputs(target.value);
  renderProducts();
});

sidebarSearchInput?.addEventListener('input', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  state.searchQuery = target.value.trim().toLowerCase();
  syncSearchInputs(target.value);

  renderProducts();
});

sortSelect?.addEventListener('change', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLSelectElement)) {
    return;
  }

  state.sortBy = target.value;
  renderProducts();
});

priceMinInput?.addEventListener('input', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  state.minPrice = target.value.trim();
  renderProducts();
});

priceMaxInput?.addEventListener('input', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  state.maxPrice = target.value.trim();
  renderProducts();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    applyFilter(button.dataset.offersFilter || 'all');
  });
});

categoryNavLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const filter = link.dataset.navFilter || 'all';
    applyFilter(filter);
    document.querySelector('#promocoes-listagem')?.scrollIntoView({ behavior: 'smooth' });
  });
});

clearFiltersButton?.addEventListener('click', clearFilters);

productGrid?.addEventListener('click', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const favoriteButton = target.closest('[data-favorite-product]');
  const addButton = target.closest('[data-add-to-cart]');

  if (favoriteButton instanceof HTMLElement) {
    const productId = Number(favoriteButton.dataset.favoriteProduct);

    if (state.favorites.has(productId)) {
      state.favorites.delete(productId);
    } else {
      state.favorites.add(productId);
    }

    renderProducts();
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
  alert('Na proxima etapa vamos conectar checkout, login e persistencia do carrinho.');
});

backToHomeButton?.addEventListener('click', scrollToTop);

window.addEventListener('scroll', syncBackToHomeVisibility, { passive: true });
window.addEventListener('load', syncLayoutOffsets);
window.addEventListener('resize', syncLayoutOffsets);

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeCart();
  }
});

syncLayoutOffsets();
syncBackToHomeVisibility();
initializeOffersPage();
