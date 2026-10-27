'use strict';

// 商品列表负责获取和显示数据，cart 数组负责记录购物车。

// 1. 获取页面元素。HTML 的 defer 保证这些元素已存在。
const productList = document.querySelector('#products');
const productRegion = document.querySelector('#product-region');
const loading = document.querySelector('#loading');
const errorBox = document.querySelector('#error');
const errorMessage = document.querySelector('#error-message');
const empty = document.querySelector('#empty');
const resultCount = document.querySelector('#result-count');
const reloadButton = document.querySelector('#reload');
const retryButton = document.querySelector('#retry');
const cartList = document.querySelector('#cart-items');
const cartEmpty = document.querySelector('#cart-empty');
const cartMessage = document.querySelector('#cart-message');
const totalQuantity = document.querySelector('#total-quantity');
const totalPrice = document.querySelector('#total-price');
const clearCartButton = document.querySelector('#clear-cart');
const saveStatus = document.querySelector('#save-status');

const API_URL = 'https://dummyjson.com/products?limit=30';
const STORAGE_KEY = 'day-20-cart';
const MAX_QUANTITY = 99;
const money = new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'USD' });
let isLoading = false;
let cart = [];

// 数量必须是 1～99 的整数，输入和读取本地数据时都用这个检查。
function isValidQuantity(quantity) {
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= MAX_QUANTITY;
}

// 2. 渲染函数：接收商品数组，把数据转换成 HTML 元素。
function renderProducts(products) {
  // 清空旧列表，避免重复加载时追加相同商品。
  productList.replaceChildren();
  empty.hidden = products.length > 0;
  resultCount.textContent = '共 ' + products.length + ' 件商品';

  products.forEach(function (product) {
    const card = document.createElement('article');
    card.className = 'product-card';

    const imageBox = document.createElement('div');
    imageBox.className = 'product-image';
    const image = document.createElement('img');
    image.alt = product.title;
    image.loading = 'lazy';
    const fallback = document.createElement('span');
    fallback.className = 'image-fallback';
    fallback.textContent = '暂无图片';
    fallback.hidden = true;
    image.addEventListener('error', function () {
      image.hidden = true;
      fallback.hidden = false;
    });
    if (typeof product.thumbnail === 'string' && product.thumbnail.startsWith('https://')) {
      image.src = product.thumbnail;
    } else {
      image.hidden = true;
      fallback.hidden = false;
    }
    imageBox.append(image, fallback);

    const body = document.createElement('div');
    body.className = 'product-body';
    const title = document.createElement('h3');
    // 接口文字使用 textContent，避免被当成 HTML 解析。
    title.textContent = product.title;
    const price = document.createElement('p');
    price.className = 'price';
    price.textContent = money.format(product.price);
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'add-button';
    addButton.textContent = '加入购物车';
    addButton.setAttribute('aria-label', '加入购物车：' + product.title);
    addButton.addEventListener('click', function () {
      addToCart(product);
    });

    body.append(title, price, addButton);
    card.append(imageBox, body);
    productList.append(card);
  });
}

// 3. 请求商品，成功后交给 renderProducts 显示。
async function loadProducts() {
  if (isLoading) return;
  isLoading = true;
  loading.hidden = false;
  errorBox.hidden = true;
  errorMessage.textContent = '';
  empty.hidden = true;
  productList.replaceChildren();
  resultCount.textContent = '正在获取商品…';
  productRegion.setAttribute('aria-busy', 'true');
  reloadButton.disabled = true;
  retryButton.disabled = true;

  // 超过 10 秒取消请求，避免加载提示一直显示。
  const controller = new AbortController();
  const timeoutId = setTimeout(function () { controller.abort(); }, 10000);

  try {
    const response = await fetch(API_URL, { signal: controller.signal });
    // HTTP 404 / 500 不会让 fetch 自动抛出异常，需要检查 response.ok。
    if (!response.ok) throw new Error('接口返回 HTTP ' + response.status);

    const data = await response.json();
    // API 返回对象，商品数组位于 data.products。
    if (!data || !Array.isArray(data.products)) throw new Error('接口没有返回商品数组');
    const valid = data.products.every(function (product) {
      return product && Number.isSafeInteger(product.id) && product.id > 0 &&
        typeof product.title === 'string' && product.title.trim() &&
        Number.isFinite(product.price) && product.price >= 0 && product.price <= 1000000;
    });
    if (!valid) throw new Error('商品数据格式不正确');

    renderProducts(data.products);
  } catch (error) {
    errorBox.hidden = false;
    resultCount.textContent = '本次加载失败';
    errorMessage.textContent = error.name === 'AbortError'
      ? '请求超过 10 秒，请检查网络后重试。'
      : '请检查网络后重试。错误信息：' + error.message;
  } finally {
    // 成功、空数据、失败都会执行这里。
    clearTimeout(timeoutId);
    isLoading = false;
    loading.hidden = true;
    productRegion.setAttribute('aria-busy', 'false');
    reloadButton.disabled = false;
    retryButton.disabled = false;
  }
}

// 4. 加入购物车：根据 ID 查找，已有商品加 1，没有则新增记录。
function addToCart(product) {
  const existing = cart.find(function (item) {
    return item.id === product.id;
  });

  if (existing) {
    if (existing.quantity >= MAX_QUANTITY) {
      cartMessage.textContent = '每种商品最多添加 99 件。';
      return;
    }
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
    });
  }

  updateCart();
  cartMessage.textContent = '已添加：' + product.title;
}

// 5. 渲染购物车。修改数组后，需要主动更新页面。
function renderCart() {
  cartList.replaceChildren();
  cartEmpty.hidden = cart.length > 0;
  clearCartButton.disabled = cart.length === 0;

  cart.forEach(function (item) {
    const row = document.createElement('li');
    row.className = 'cart-item';
    const title = document.createElement('h3');
    title.textContent = item.title;
    const unitPrice = document.createElement('p');
    unitPrice.className = 'unit-price';
    unitPrice.textContent = '单价：' + money.format(item.price);

    const controls = document.createElement('div');
    controls.className = 'cart-controls';
    const label = document.createElement('label');
    label.htmlFor = 'quantity-' + item.id;
    label.textContent = '数量';
    const input = document.createElement('input');
    input.id = 'quantity-' + item.id;
    input.type = 'number';
    input.min = '1';
    input.max = String(MAX_QUANTITY);
    input.step = '1';
    input.inputMode = 'numeric';
    input.value = item.quantity;
    input.setAttribute('aria-label', item.title + '的数量');
    input.addEventListener('change', function () {
      const quantity = Number(input.value);
      if (!isValidQuantity(quantity)) {
        input.value = item.quantity;
        cartMessage.textContent = '数量请输入 1～99 的整数。';
        return;
      }

      item.quantity = quantity;
      updateCart();
      cartMessage.textContent = '数量已更新。';
      // 重新生成输入框后，把焦点放回当前商品，方便键盘操作。
      document.querySelector('#quantity-' + item.id).focus({ preventScroll: true });
    });
    label.append(input);

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'remove-button';
    removeButton.textContent = '删除';
    removeButton.setAttribute('aria-label', '删除：' + item.title);
    removeButton.addEventListener('click', function () {
      cart = cart.filter(function (product) {
        return product.id !== item.id;
      });
      updateCart();
      cartMessage.textContent = '已删除：' + item.title;
      document.querySelector('#cart-title').focus({ preventScroll: true });
    });
    controls.append(label, removeButton);

    const subtotal = document.createElement('p');
    subtotal.className = 'subtotal';
    // 例如单价 2.50、数量 3：先算 250 分 × 3，再除以 100 显示 7.50。
    const subtotalCents = Math.round(item.price * 100) * item.quantity;
    subtotal.textContent = '小计：' + money.format(subtotalCents / 100);
    row.append(title, unitPrice, controls, subtotal);
    cartList.append(row);
  });

  const quantity = cart.reduce(function (sum, item) {
    return sum + item.quantity;
  }, 0);
  // 每次把“单价 × 数量”累加到 sum；用整数分计算，减少小数误差。
  const totalCents = cart.reduce(function (sum, item) {
    return sum + Math.round(item.price * 100) * item.quantity;
  }, 0);
  totalQuantity.textContent = quantity + ' 件';
  totalPrice.textContent = money.format(totalCents / 100);
}

// 6. 保存和读取购物车。localStorage 中的值是字符串。
function saveCart() {
  try {
    const saved = JSON.stringify(cart);
    localStorage.setItem(STORAGE_KEY, saved);
    saveStatus.textContent = '购物车已保存。';
    saveStatus.classList.remove('warning');
  } catch {
    // 保存失败时保留内存中的购物车，页面仍能继续操作。
    saveStatus.textContent = '保存失败，刷新后可能丢失本次修改。';
    saveStatus.classList.add('warning');
  }
}

function readCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return;
    const items = JSON.parse(saved);
    // JSON 能解析，不代表里面的字段和数量一定有效。
    const valid = Array.isArray(items) && items.every(function (item) {
      return item && Number.isSafeInteger(item.id) && item.id > 0 &&
        typeof item.title === 'string' && item.title.trim() &&
        Number.isFinite(item.price) && item.price >= 0 && item.price <= 1000000 &&
        isValidQuantity(item.quantity);
    });
    if (!valid) throw new Error('购物车格式不正确');
    const ids = new Set(items.map(function (item) { return item.id; }));
    if (ids.size !== items.length) throw new Error('购物车中有重复商品');

    cart = items.map(function (item) {
      return { id: item.id, title: item.title, price: item.price, quantity: item.quantity };
    });
    saveStatus.textContent = '已恢复上次保存的购物车。';
  } catch {
    saveStatus.textContent = '未能读取购物车，本次从空购物车开始。';
    saveStatus.classList.add('warning');
  }
}

// 每次修改后统一更新页面和存储，避免只改了一处。
function updateCart() {
  renderCart();
  saveCart();
}

// 7. 事件监听：重新加载和错误重试使用同一个请求函数。
reloadButton.addEventListener('click', loadProducts);
retryButton.addEventListener('click', loadProducts);
clearCartButton.addEventListener('click', function () {
  cart = [];
  updateCart();
  cartMessage.textContent = '购物车已清空。';
  document.querySelector('#cart-title').focus({ preventScroll: true });
});

// 先恢复购物车，再加载商品。商品接口失败时，已保存的购物车仍可操作。
readCart();
renderCart();
loadProducts();
