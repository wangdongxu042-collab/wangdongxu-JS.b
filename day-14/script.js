'use strict';

const products = [
  { id: 1, name: '晨间笔记本', category: '文具', price: 28, sales: 320 },
  { id: 2, name: '阅读台灯', category: '家居', price: 129, sales: 180 },
  { id: 3, name: '无线鼠标', category: '数码', price: 89, sales: 460 },
  { id: 4, name: '机械键盘', category: '数码', price: 299, sales: 260 },
  { id: 5, name: '陶瓷马克杯', category: '家居', price: 59, sales: 510 },
  { id: 6, name: '钢笔套装', category: '文具', price: 159, sales: 95 }
];

function renderProducts(items) {
  const list = document.querySelector('#products');
  list.replaceChildren();
  items.forEach(function (item) {
    const card = document.createElement('article');
    card.className = 'product';
    const name = document.createElement('h3');
    name.textContent = item.name;
    const info = document.createElement('p');
    info.className = 'muted';
    info.textContent = item.category + ' · 销量 ' + item.sales;
    const price = document.createElement('p');
    price.className = 'price';
    price.textContent = '¥' + item.price;
    card.append(name, info, price);
    list.append(card);
  });
  document.querySelector('#result-count').textContent = items.length ? '共 ' + items.length + ' 件商品' : '没有找到符合条件的商品。';
}

const keyword = document.querySelector('#keyword');
const category = document.querySelector('#category');
const sort = document.querySelector('#sort');
function updateProducts() {
  const word = keyword.value.trim().toLowerCase();
  // 第一步：过滤。filter 已经返回新数组，排序不会影响 products。
  const result = products.filter(function (item) {
    return item.name.toLowerCase().includes(word) && (category.value === 'all' || item.category === category.value);
  });
  // 第二步：排序。
  if (sort.value === 'price-asc') result.sort(function (a, b) { return a.price - b.price; });
  if (sort.value === 'price-desc') result.sort(function (a, b) { return b.price - a.price; });
  if (sort.value === 'sales') result.sort(function (a, b) { return b.sales - a.sales; });
  // 第三步：根据最终数据更新 DOM。
  renderProducts(result);
}
keyword.addEventListener('input', updateProducts);
category.addEventListener('change', updateProducts);
sort.addEventListener('change', updateProducts);
document.querySelector('#reset').addEventListener('click', function () {
  keyword.value = '';
  category.value = 'all';
  sort.value = 'default';
  updateProducts();
});
updateProducts();
