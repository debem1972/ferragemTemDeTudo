import { getProducts } from '../services/products.js';

const state = {
  products: [],
  filteredProducts: [],
  activeFilter: 'all',
  cart: [],
};

const searchForm = document.querySelector('.search');
const productGrid = document.querySelector('[data-product-grid]');
const productCount = document.querySelector('[data-product-count]');
const filterButtons = document.querySelectorAll('[data-filter]');
const cartList = document.querySelector('[data-cart-list]');
const cartCount = document.querySelector('[data-cart-count]');
const cartTotal = document.querySelector('[data-cart-total]');
const clearCartButton = document.querySelector('[data-clear-cart]');
const checkoutButton = document.querySelector('[data-checkout-button]');

function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
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
          <span class="product-card__tag">${product.badge}</span>
          <h3>${product.nome}</h3>
          <p>${product.descricao}</p>
          <div class="catalog-card__footer">
            <strong>${formatPrice(product.preco)}</strong>
            <button class="button button--primary" type="button" data-add-to-cart="${product.id}">
              Comprar
            </button>
          </div>
        </article>
      `,
    )
    .join('');

  if (productCount) {
    productCount.textContent = `${products.length} produtos em destaque`;
  }
}

function renderCart() {
  if (!cartList || !cartCount || !cartTotal) {
    return;
  }

  if (!state.cart.length) {
    cartList.innerHTML = '<p class="empty-state">Seu carrinho ainda esta vazio.</p>';
    cartCount.textContent = '0';
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
  const totalPrice = state.cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

  cartCount.textContent = String(totalItems);
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

checkoutButton?.addEventListener('click', () => {
  if (!state.cart.length) {
    return;
  }

  alert('Checkout simulado iniciado. Na proxima etapa integraremos este fluxo.');
});

const revealElements = document.querySelectorAll(
  '.hero__panel, .hero__visual, .category-card, .product-card, .security-card, .admin-spotlight',
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

initializeCatalog();
