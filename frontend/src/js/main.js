import { getProducts } from '../services/products.js';

const state = {
  products: [],
  filteredProducts: [],
  activeFilter: 'all',
  searchQuery: '',
  carouselPage: 0,
  cart: [],
  focusedProduct: null,
};

const searchForm = document.querySelector('.search');
const offersGrid = document.querySelector('.offers__grid');
const productGrid = document.querySelector('[data-product-grid]');
const productCount = document.querySelector('[data-product-count]');
const carouselViewport = document.querySelector('.catalog__viewport');
const carouselPrevButton = document.querySelector('[data-carousel-prev]');
const carouselNextButton = document.querySelector('[data-carousel-next]');
const carouselPagination = document.querySelector('[data-carousel-pagination]');
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
const plpLinks = document.querySelectorAll('[data-plp-link]');
const siteHeader = document.querySelector('.header');
const categoryNav = document.querySelector('.category-nav');

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

function getVisualIcon(visual) {
  const icons = {
    tool: 'bi-tools',
    box: 'bi-box-seam',
    electric: 'bi-lightning-charge',
    water: 'bi-droplet-half',
    solar: 'bi-sun',
    driver: 'bi-screwdriver',
    bulb: 'bi-lightbulb',
    pipe: 'bi-bezier2',
    hinge: 'bi-bounding-box',
    inverter: 'bi-cpu',
  };

  return icons[visual] || 'bi-box-seam';
}

function getItemsPerView() {
  if (window.innerWidth <= 720) {
    return 1;
  }

  if (window.innerWidth <= 1180) {
    return 2;
  }

  return 3;
}

function getCuratedProducts(products) {
  return products.slice(0, 10);
}

function getDisplayProducts() {
  let products = getCuratedProducts(state.products);

  if (state.activeFilter !== 'all') {
    products = products.filter((product) => product.categoria === state.activeFilter);
  }

  if (state.searchQuery) {
    products = products.filter((product) => {
      return (
        product.nome.toLowerCase().includes(state.searchQuery) ||
        product.descricao.toLowerCase().includes(state.searchQuery) ||
        product.categoria.toLowerCase().includes(state.searchQuery)
      );
    });
  }

  return products;
}

function getCarouselPageCount(products) {
  return Math.max(1, Math.ceil(products.length / getItemsPerView()));
}

function syncCarouselControls(products) {
  const pageCount = getCarouselPageCount(products);

  if (state.carouselPage > pageCount - 1) {
    state.carouselPage = pageCount - 1;
  }

  if (state.carouselPage < 0) {
    state.carouselPage = 0;
  }

  if (carouselPrevButton) {
    carouselPrevButton.disabled = state.carouselPage === 0;
  }

  if (carouselNextButton) {
    carouselNextButton.disabled = state.carouselPage >= pageCount - 1 || !products.length;
  }
}

function renderCarouselPagination(products) {
  if (!carouselPagination) {
    return;
  }

  const pageCount = getCarouselPageCount(products);

  carouselPagination.innerHTML = Array.from({ length: pageCount }, (_, index) => {
    const isActive = index === state.carouselPage;
    return `
      <button
        class="catalog__dot${isActive ? ' is-active' : ''}"
        type="button"
        aria-label="Ir para pagina ${index + 1} do carousel"
        data-carousel-page="${index}"
      ></button>
    `;
  }).join('');
}

function renderProducts(products) {
  if (!productGrid) {
    return;
  }

  const itemsPerView = getItemsPerView();

  if (!products.length) {
    productGrid.innerHTML =
      '<p class="empty-state">Nenhum produto encontrado para este filtro.</p>';
    productGrid.style.removeProperty('transform');
    productGrid.style.removeProperty('--items-per-view');

    if (productCount) {
      productCount.textContent = '0 produtos em destaque';
    }

    syncCarouselControls(products);
    renderCarouselPagination(products);
    return;
  }

  productGrid.style.setProperty('--items-per-view', String(itemsPerView));

  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="catalog-card reveal is-visible">
          <button
            class="catalog-card__media catalog-card__media--${product.visual || 'tool'}"
            type="button"
            aria-label="Ver detalhes de ${product.nome}"
            data-focus-product="${product.id}"
          >
            <span>${product.categoriaLabel || product.categoria}</span>
            <i class="bi ${getVisualIcon(product.visual)} catalog-card__glyph" aria-hidden="true"></i>
          </button>

          <div class="catalog-card__body">
            <span class="product-card__tag">${product.badge}</span>
            <button
              class="catalog-card__title"
              type="button"
              aria-label="Ver detalhes de ${product.nome}"
              data-focus-product="${product.id}"
            >
              ${product.nome}
            </button>
            <p>${product.descricao}</p>

            <div class="catalog-card__highlights">
              ${product.curatedHighlights
                .map(
                  (highlight) => `
                    <article class="catalog-card__highlight">
                      <i class="bi ${highlight.icon}" aria-hidden="true"></i>
                      <span>${highlight.label}</span>
                    </article>
                  `,
                )
                .join('')}
            </div>

            <div class="catalog-card__footer">
              <strong>${formatPrice(product.preco)}</strong>
              <div class="catalog-card__actions">
                <button class="catalog-card__details" type="button" data-focus-product="${product.id}">
                  Ver detalhes
                </button>
                <button class="button button--primary catalog-card__button" type="button" data-add-to-cart="${product.id}">
                  Comprar <i class="bi bi-cart3"></i>
                </button>
              </div>
            </div>
          </div>
        </article>
      `,
    )
    .join('');

  if (productCount) {
    productCount.textContent = `${products.length} produtos em destaque selecionados`;
  }

  syncCarouselControls(products);
  renderCarouselPagination(products);

  requestAnimationFrame(() => {
    const firstCard = productGrid.querySelector('.catalog-card');

    if (!(firstCard instanceof HTMLElement) || !(carouselViewport instanceof HTMLElement)) {
      productGrid.style.removeProperty('transform');
      productGrid.style.removeProperty('width');
      return;
    }

    const gridStyles = window.getComputedStyle(productGrid);
    const gap = Number.parseFloat(gridStyles.columnGap || gridStyles.gap || '0');
    const viewportWidth = carouselViewport.getBoundingClientRect().width;
    const cardWidth = (viewportWidth - gap * (itemsPerView - 1)) / itemsPerView;
    const cards = productGrid.querySelectorAll('.catalog-card');
    const pageStart = state.carouselPage * itemsPerView;
    const offset = pageStart * (cardWidth + gap);

    cards.forEach((card) => {
      if (card instanceof HTMLElement) {
        card.style.width = `${cardWidth}px`;
      }
    });

    productGrid.style.width = `${products.length * cardWidth + Math.max(products.length - 1, 0) * gap}px`;
    productGrid.style.transform = `translateX(-${offset}px)`;
  });
}

function syncLayoutOffsets() {
  if (!siteHeader) {
    return;
  }

  const headerHeight = Math.ceil(siteHeader.getBoundingClientRect().height);
  const categoryNavHeight = categoryNav ? Math.ceil(categoryNav.getBoundingClientRect().height) : 0;

  if (window.innerWidth <= 720) {
    document.documentElement.style.removeProperty('--category-nav-offset');
    document.documentElement.style.setProperty('--fixed-stack-height', `${headerHeight}px`);
    document.documentElement.style.setProperty('--catalog-scroll-offset', `${headerHeight + 20}px`);
    document.documentElement.style.setProperty(
      '--catalog-viewport-height',
      `calc(100vh - ${headerHeight + 24}px)`,
    );
    return;
  }

  document.documentElement.style.setProperty('--category-nav-offset', `${headerHeight}px`);
  document.documentElement.style.setProperty(
    '--fixed-stack-height',
    `${headerHeight + categoryNavHeight}px`,
  );
  document.documentElement.style.setProperty(
    '--catalog-scroll-offset',
    `${headerHeight + categoryNavHeight + 18}px`,
  );
  document.documentElement.style.setProperty(
    '--catalog-viewport-height',
    `calc(100vh - ${headerHeight + categoryNavHeight + 26}px)`,
  );
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
  state.carouselPage = 0;
  state.filteredProducts = getDisplayProducts();

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
  state.filteredProducts = getDisplayProducts();
  applyFilter('all');
  renderCart();
}

if (searchForm) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(searchForm);
    state.searchQuery = String(formData.get('search-input') || '')
      .trim()
      .toLowerCase();

    if (!state.searchQuery) {
      applyFilter(state.activeFilter);
      document.querySelector('#catalogo')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    state.carouselPage = 0;
    state.filteredProducts = getDisplayProducts();
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

carouselPrevButton?.addEventListener('click', () => {
  state.carouselPage -= 1;
  renderProducts(state.filteredProducts);
});

carouselNextButton?.addEventListener('click', () => {
  state.carouselPage += 1;
  renderProducts(state.filteredProducts);
});

carouselPagination?.addEventListener('click', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const pageButton = target.closest('[data-carousel-page]');

  if (pageButton instanceof HTMLElement) {
    state.carouselPage = Number(pageButton.dataset.carouselPage);
    renderProducts(state.filteredProducts);
  }
});

plpLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    alert('Na proxima etapa vamos criar a PLP completa para exibir todo o catalogo.');
  });
});

accountCtaButton?.addEventListener('click', () => {
  alert('Na proxima etapa vamos criar login/cadastro e uma pagina propria de checkout.');
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeCart();
  }
});

window.addEventListener('resize', () => {
  renderProducts(state.filteredProducts);
});

const revealElements = document.querySelectorAll(
  '.hero__panel, .hero__visual, .product-card, .security-card, .reason-card',
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

syncLayoutOffsets();
window.addEventListener('load', syncLayoutOffsets);
window.addEventListener('resize', syncLayoutOffsets);

initializeCatalog();
