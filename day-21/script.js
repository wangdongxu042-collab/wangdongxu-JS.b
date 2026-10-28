/**
 * 购物车中的商品格式：{ name: "帆布包", price: 80, quantity: 2 }
 * price 的单位是元，quantity 是正整数；空数组代表空购物车。
 * 使用「分」计算金额，避免 0.1 + 0.2 这类浮点误差。
 */
function calculateTotal(cart) {
  // 1. 空购物车直接返回 0，不收运费。
  if (cart.length === 0) return 0;

  // 2. 数组中每个商品对象：单价（分）× 数量，再累加。
  const subtotal = cart.reduce((sum, item) => {
    return sum + Math.round(item.price * 100) * item.quantity;
  }, 0);

  // 3. 满 300 元打九折，折扣金额四舍五入到分。
  const discountedTotal = subtotal >= 30000 ? Math.round(subtotal * 0.9) : subtotal;

  // 4. 根据折后金额判断运费，不足 200 元加 15 元。
  const shipping = discountedTotal < 20000 ? 1500 : 0;

  // 5. 转回元，返回数字（不要使用会返回字符串的 toFixed）。
  return (discountedTotal + shipping) / 100;
}

// 以下是页面交互。calculateTotal 不依赖页面，可以独立调用。
let cart = [
  { name: "日常帆布包", price: 89, quantity: 1 },
  { name: "方格笔记本", price: 32, quantity: 2 },
  { name: "陶瓷马克杯", price: 68, quantity: 1 },
];

const money = (amount) => `¥${amount.toFixed(2)}`;
const cartItems = document.querySelector("#cart-items");
const form = document.querySelector("#add-form");
const message = document.querySelector("#form-message");

function renderCart() {
  cartItems.replaceChildren();

  cart.forEach((item, index) => {
    const row = document.createElement("li");
    row.className = "cart-item";
    // 用户填写的商品名称通过 textContent 设置，避免被当作 HTML 执行。
    row.innerHTML = `
      <span class="product-icon" aria-hidden="true">▧</span>
      <div class="product-info"><strong class="product-name"></strong><span class="unit-price"></span></div>
      <div class="quantity"><button type="button" data-action="decrease">−</button><span></span><button type="button" data-action="increase">＋</button></div>
      <strong class="line-price"></strong>
      <button class="remove" type="button" data-action="remove">×</button>`;
    row.dataset.index = index;
    row.querySelector(".product-name").textContent = item.name;
    row.querySelector(".unit-price").textContent = `${money(item.price)} / 件`;
    row.querySelector(".quantity span").textContent = item.quantity;
    row.querySelector(".line-price").textContent = money(Math.round(item.price * 100) * item.quantity / 100);
    const decrease = row.querySelector('[data-action="decrease"]');
    decrease.disabled = item.quantity <= 1;
    decrease.setAttribute("aria-label", `减少${item.name}的数量`);
    const increase = row.querySelector('[data-action="increase"]');
    increase.disabled = item.quantity >= 999;
    increase.setAttribute("aria-label", `增加${item.name}的数量`);
    row.querySelector(".remove").setAttribute("aria-label", `移除${item.name}`);
    cartItems.append(row);
  });

  const subtotal = cart.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0);
  const discountedTotal = subtotal >= 30000 ? Math.round(subtotal * 0.9) : subtotal;
  const shipping = cart.length > 0 && discountedTotal < 20000 ? 1500 : 0;

  document.querySelector("#item-count").textContent = `${cart.reduce((sum, item) => sum + item.quantity, 0)} 件`;
  document.querySelector("#empty-cart").hidden = cart.length > 0;
  document.querySelector("#clear-cart").disabled = cart.length === 0;
  document.querySelector("#subtotal").textContent = money(subtotal / 100);
  document.querySelector("#discount").textContent = `−${money((subtotal - discountedTotal) / 100)}`;
  document.querySelector("#discounted-total").textContent = money(discountedTotal / 100);
  document.querySelector("#shipping").textContent = money(shipping / 100);
  document.querySelector("#total").textContent = money(calculateTotal(cart));
  document.querySelector("#shipping-note").textContent = cart.length === 0
    ? "空购物车不收取运费。"
    : shipping > 0
      ? `折后再购 ${money((20000 - discountedTotal) / 100)} 即可免运费。`
      : "已满足折后满 200 元，享受免运费。";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.elements.name.value.trim();
  const price = Number(form.elements.price.value);
  const quantity = Number(form.elements.quantity.value);
  if (!name) {
    message.textContent = "请输入商品名称，不能只填写空格。";
    form.elements.name.focus();
    return;
  }
  if (!Number.isFinite(price) || price < 0.01 || price > 999999 || !Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
    message.textContent = "请输入有效的单价和数量。";
    return;
  }
  cart.push({ name, price: Math.round(price * 100) / 100, quantity });
  form.reset();
  renderCart();
  message.textContent = `已添加「${name}」。`;
  form.elements.name.focus();
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const index = Number(button.closest(".cart-item").dataset.index);
  const action = button.dataset.action;
  if (action === "increase" && cart[index].quantity < 999) cart[index].quantity += 1;
  if (action === "decrease" && cart[index].quantity > 1) cart[index].quantity -= 1;
  if (action === "remove") cart.splice(index, 1);
  message.textContent = "";
  renderCart();
  // 重绘后恢复键盘焦点，便于连续调整数量。
  const nextRow = cartItems.children[Math.min(index, cart.length - 1)];
  const nextButton = nextRow?.querySelector(`[data-action="${action}"]:not(:disabled)`)
    || nextRow?.querySelector("button:not(:disabled)")
    || form.querySelector("input");
  nextButton.focus();
});

document.querySelector("#clear-cart").addEventListener("click", () => {
  cart = [];
  message.textContent = "已清空购物车。";
  renderCart();
  form.elements.name.focus();
});

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    const price = Number(button.dataset.example);
    cart = price === 0 ? [] : [{ name: "边界测试商品", price, quantity: 1 }];
    message.textContent = "";
    renderCart();
  });
});

renderCart();
