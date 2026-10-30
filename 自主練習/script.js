'use strict';

// 1. 数据：商品来自接口；购物车保留商品快照，断网时也能查看已保存的内容。
const API_URL = 'https://dummyjson.com/products?limit=30';
const STORAGE_KEY = 'js-practice-cart-v1';
const MAX_QUANTITY = 99;
const state = { products: [], cart: [], loading: false, error: '' };
const $ = (selector) => document.querySelector(selector);
const money = new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'USD' });
const categoryNames = {
  beauty: '美妆', fragrances: '香水', furniture: '家具', groceries: '食品',
};
const categoryName = (value) => categoryNames[value] || value;
// 用整数“分”计算金额，避免 0.1 + 0.2 这类小数误差。
const toCents = (price) => Math.round(price * 100);
const formatMoney = (cents) => money.format(cents / 100);
let announcementTimer;

function announce(message) {
  clearTimeout(announcementTimer);
  $('#announcement').textContent = message;
  announcementTimer = setTimeout(() => { $('#announcement').textContent = ''; }, 2500);
}

// 2. 本地保存：JSON.parse / setItem 都可能出错，不能让它们阻止页面运行。
function storageMessage(message, warning = false) {
  $('#save-status').textContent = message;
  $('#save-status').classList.toggle('warning', warning);
}

function readCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const items = JSON.parse(saved);
    if (!Array.isArray(items)) throw new Error('购物车格式不正确');
    const seen = new Set();
    state.cart = items.filter((item) => {
      if (!item || !Number.isSafeInteger(item.id) || item.id < 1 ||
          typeof item.title !== 'string' || !item.title.trim() ||
          !Number.isFinite(item.price) || item.price < 0 || item.price > 1000000 ||
          !Number.isInteger(item.quantity) || item.quantity < 1 ||
          item.quantity > MAX_QUANTITY || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    }).map(({ id, title, price, quantity }) => ({ id, title, price, quantity }));
    if (state.cart.length !== items.length) {
      storageMessage('已忽略无效的购物车记录，可继续使用。', true);
    } else {
      storageMessage('已恢复上次的购物车，修改后会自动保存。');
    }
  } catch {
    storageMessage('无法读取已保存的购物车，本次仍可正常使用。', true);
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
    storageMessage('购物车已自动保存，刷新页面后依然保留。');
  } catch {
    storageMessage('浏览器无法保存购物车，关闭页面后可能丢失。', true);
  }
}

// 3. 请求：检查 HTTP 状态和返回格式，超时后允许重试。
async function loadProducts() {
  if (state.loading) return;
  state.loading = true;
  state.error = '';
  renderProducts();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(API_URL, { signal: controller.signal });
    if (!response.ok) throw new Error('接口返回 HTTP ' + response.status);
    const data = await response.json();
    if (!Array.isArray(data.products) || !data.products.every((product) =>
      product && Number.isSafeInteger(product.id) && product.id > 0 &&
      typeof product.title === 'string' && typeof product.category === 'string' &&
      Number.isFinite(product.price) && product.price >= 0 && product.price <= 1000000
    )) throw new Error('接口返回的商品格式不正确');
    state.products = data.products;
    renderCategories();
  } catch (error) {
    state.error = error.name === 'AbortError'
      ? '请求超过 10 秒，请检查网络后重试。'
      : '请检查网络后重试。' + (error instanceof TypeError ? '' : '（' + error.message + '）');
  } finally {
    clearTimeout(timeout);
    state.loading = false;
    renderProducts();
  }
}

function renderCategories() {
  const select = $('#category');
  const previousValue = select.value;
  select.replaceChildren(new Option('全部分类', 'all'));
  const categories = [...new Set(state.products.map((product) => product.category))];
  categories.forEach((category) => select.add(new Option(categoryName(category), category)));
  select.value = categories.includes(previousValue) ? previousValue : 'all';
}

// 4. 搜索 + 分类 + 排序：filter 返回新数组，sort 不会改动原始商品列表。
function getVisibleProducts() {
  const keyword = $('#search').value.trim().toLowerCase();
  const category = $('#category').value;
  const products = state.products.filter((product) => {
    const text = [product.title, product.description || '', product.category,
      categoryName(product.category)].join(' ').toLowerCase();
    return text.includes(keyword) && (category === 'all' || product.category === category);
  });
  if ($('#sort').value === 'price-asc') products.sort((a, b) => a.price - b.price);
  if ($('#sort').value === 'price-desc') products.sort((a, b) => b.price - a.price);
  if ($('#sort').value === 'name') products.sort((a, b) => a.title.localeCompare(b.title));
  return products;
}

function renderProducts() {
  const products = getVisibleProducts();
  const ready = !state.loading && !state.error;
  $('#loading').hidden = !state.loading;
  $('#error').hidden = !state.error;
  $('#error-message').textContent = state.error;
  $('#empty').hidden = !ready || products.length > 0;
  $('#empty-title').textContent = state.products.length ? '没有找到商品' : '接口暂时没有商品';
  $('#product-region').setAttribute('aria-busy', String(state.loading));
  $('#reload').disabled = state.loading;
  $('#retry').disabled = state.loading;
  $('#result-count').textContent = state.loading ? '正在从接口获取商品…'
    : state.error ? '加载失败，可点击重试'
    : `显示 ${products.length} / ${state.products.length} 件商品`;
  $('#products').replaceChildren();
  if (!ready) return;
  const fragment = document.createDocumentFragment();
  products.forEach((product) => {
    const card = $('#product-template').content.cloneNode(true);
    card.querySelector('h3').textContent = product.title;
    card.querySelector('.product-category').textContent = categoryName(product.category);
    card.querySelector('.price').textContent = formatMoney(toCents(product.price));
    const button = card.querySelector('button');
    button.dataset.id = product.id;
    button.setAttribute('aria-label', '加入购物车：' + product.title);
    const image = card.querySelector('img');
    const fallback = card.querySelector('.image-fallback');
    image.alt = product.title;
    image.addEventListener('error', () => { image.hidden = true; fallback.hidden = false; });
    // 接口文字使用 textContent，图片仅接受 HTTPS 地址。
    if (typeof product.thumbnail === 'string' && product.thumbnail.startsWith('https://')) {
      image.src = product.thumbnail;
    } else {
      image.hidden = true;
      fallback.hidden = false;
    }
    fragment.append(card);
  });
  $('#products').append(fragment);
}

// 5. 购物车：同一商品累加数量；数量范围为 1–99，删除通过独立按钮完成。
function addToCart(id) {
  const product = state.products.find((item) => item.id === id);
  if (!product) return;
  const existing = state.cart.find((item) => item.id === id);
  if (existing && existing.quantity >= MAX_QUANTITY) {
    announce('每件商品最多添加 99 件。');
    return;
  }
  if (existing) existing.quantity += 1;
  else state.cart.push({ id, title: product.title, price: product.price, quantity: 1 });
  updateCart();
  announce('已加入购物车：' + product.title);
}

function updateCart() {
  saveCart();
  renderCart();
}

function renderCart() {
  // 记录焦点，避免点击加减或修改数量后键盘焦点丢失。
  const focused = document.activeElement;
  const focusedRow = focused.closest('[data-cart-id]');
  const focusId = focusedRow ? focusedRow.dataset.cartId : null;
  const focusAction = focused.dataset.action;
  const list = $('#cart-items');
  list.replaceChildren();
  state.cart.forEach((item) => {
    const row = $('#cart-template').content.cloneNode(true);
    row.querySelector('li').dataset.cartId = item.id;
    row.querySelector('h3').textContent = item.title;
    row.querySelector('.unit-price').textContent = formatMoney(toCents(item.price)) + ' / 件';
    row.querySelector('.subtotal').textContent = formatMoney(toCents(item.price) * item.quantity);
    row.querySelector('input').value = item.quantity;
    row.querySelector('input').setAttribute('aria-label', item.title + '的数量');
    const labels = { decrease: '减少数量', increase: '增加数量', remove: '删除' };
    row.querySelectorAll('button').forEach((button) => {
      button.setAttribute('aria-label', labels[button.dataset.action] + '：' + item.title);
    });
    row.querySelector('[data-action="decrease"]').disabled = item.quantity === 1;
    row.querySelector('[data-action="increase"]').disabled = item.quantity === MAX_QUANTITY;
    list.append(row);
  });
  const quantity = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = state.cart.reduce((sum, item) => sum + toCents(item.price) * item.quantity, 0);
  $('#cart-empty').hidden = state.cart.length > 0;
  $('#clear-cart').disabled = state.cart.length === 0;
  $('#total-quantity').textContent = quantity + ' 件';
  $('#cart-count').textContent = quantity;
  $('#total-price').textContent = formatMoney(total);
  if (focusId) {
    const next = list.querySelector(`[data-cart-id="${focusId}"] [data-action="${focusAction}"]`);
    if (next && !next.disabled) next.focus({ preventScroll: true });
    else if (next) list.querySelector(`[data-cart-id="${focusId}"] input`).focus({ preventScroll: true });
    else if (list.querySelector('button')) list.querySelector('button').focus({ preventScroll: true });
    else {
      $('#cart-title').setAttribute('tabindex', '-1');
      $('#cart-title').focus({ preventScroll: true });
    }
  }
}

// 6. 事件委托：只在列表上绑定一次事件，动态添加的按钮也能响应。
$('#products').addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="add"]');
  if (button) addToCart(Number(button.dataset.id));
});
$('#cart-items').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const id = Number(button.closest('[data-cart-id]').dataset.cartId);
  const item = state.cart.find((product) => product.id === id);
  if (!item) return;
  if (button.dataset.action === 'remove') {
    state.cart = state.cart.filter((product) => product.id !== id);
    announce('已删除：' + item.title);
  } else {
    const difference = button.dataset.action === 'increase' ? 1 : -1;
    item.quantity = Math.min(MAX_QUANTITY, Math.max(1, item.quantity + difference));
  }
  updateCart();
});
$('#cart-items').addEventListener('change', (event) => {
  const input = event.target;
  if (input.dataset.action !== 'quantity') return;
  const id = Number(input.closest('[data-cart-id]').dataset.cartId);
  const item = state.cart.find((product) => product.id === id);
  const value = Number(input.value);
  if (!item) return;
  if (!Number.isInteger(value) || value < 1 || value > MAX_QUANTITY) {
    input.value = item.quantity;
    announce('请输入 1 到 99 之间的整数。');
    return;
  }
  item.quantity = value;
  updateCart();
});
$('#clear-cart').addEventListener('click', () => {
  state.cart = [];
  updateCart();
  announce('购物车已清空。');
});
$('#search').addEventListener('input', renderProducts);
$('#category').addEventListener('change', renderProducts);
$('#sort').addEventListener('change', renderProducts);
$('#reset').addEventListener('click', () => {
  $('#search').value = '';
  $('#category').value = 'all';
  $('#sort').value = 'default';
  renderProducts();
  $('#search').focus();
});
$('#reload').addEventListener('click', loadProducts);
$('#retry').addEventListener('click', loadProducts);

readCart();
renderCart();
loadProducts();
