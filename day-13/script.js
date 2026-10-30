'use strict';

function initialCart() {
  return [{ name: '笔记本', price: 28, quantity: 2 }, { name: '台灯', price: 129, quantity: 1 }, { name: '马克杯', price: 62, quantity: 3 }];
}
let cart = initialCart();
function calculateTotal() {
  const quantity = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
  const total = cart.reduce(function (sum, item) { return sum + item.price * item.quantity; }, 0);
  document.querySelector('#cart-total').textContent = '共 ' + quantity + ' 件 · 总价 ¥' + total.toFixed(2);
}
function renderCart() {
  const list = document.querySelector('#cart');
  list.replaceChildren();
  cart.forEach(function (item, index) {
    const li = document.createElement('li');
    const label = document.createElement('label');
    label.htmlFor = 'quantity-' + index;
    label.textContent = item.name + ' · 单价 ¥' + item.price + ' · 数量';
    const input = document.createElement('input');
    input.id = 'quantity-' + index;
    input.type = 'number';
    input.min = '0';
    input.max = '999';
    input.step = '1';
    input.value = item.quantity;
    input.addEventListener('input', function () {
      const value = input.valueAsNumber;
      if (!Number.isInteger(value) || value < 0 || value > 999) {
        input.setCustomValidity('请输入 0–999 的整数。');
        document.querySelector('#cart-total').textContent = '请将数量填写为 0–999 的整数。';
        return;
      }
      input.setCustomValidity('');
      item.quantity = value;
      // 检查其他数量框，避免掩盖另一行的输入错误。
      const valid = [...list.querySelectorAll('input')].every(function (field) { return field.validity.valid; });
      if (valid) calculateTotal();
    });
    li.append(label, input);
    list.append(li);
  });
  if (!cart.length) list.textContent = '购物车为空。';
  calculateTotal();
}
document.querySelector('#clear-cart').addEventListener('click', function () { cart = []; renderCart(); });
document.querySelector('#reset-cart').addEventListener('click', function () { cart = initialCart(); renderCart(); });
document.querySelector('#score-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const value = document.querySelector('#scores').value.trim();
  const result = document.querySelector('#average');
  if (!value) { result.textContent = '没有成绩，暂时不能计算平均分。'; return; }
  const parts = value.split(/[,，]/).map(function (part) { return part.trim(); });
  const scores = parts.map(Number);
  if (parts.some(function (part) { return part === ''; }) || scores.some(function (score) { return !Number.isFinite(score) || score < 0 || score > 100; })) {
    result.textContent = '请输入逗号分隔的有效成绩，每个成绩在 0–100 之间。';
    return;
  }
  const sum = scores.reduce(function (total, score) { return total + score; }, 0);
  result.textContent = scores.length + ' 门成绩 · 平均分 ' + (sum / scores.length).toFixed(2);
});
renderCart();
