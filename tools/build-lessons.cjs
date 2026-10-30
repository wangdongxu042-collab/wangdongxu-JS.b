// 课程源数据与静态页面生成器。重新生成：node tools/build-lessons.cjs
// 学习时直接编辑 day-XX/script.js 即可；重新生成会覆盖每日文件。
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const lessons = [];
function lesson(title, goal, tasks, html, script, tip) {
  lessons.push({ title, goal, tasks, html, script: script.trim() + '\n', tip });
}
const raw = String.raw;

lesson('选择元素', '用 querySelector 和 querySelectorAll 找到页面元素。',
  ['在 Console 中找到标题、按钮、输入框、列表和所有列表项。', '标题从“原标题”变为“新标题”。', '点击按钮后显示输入框的当前值。'],
  `<h2 id="title">原标题</h2><label for="name">输入框</label><input id="name" placeholder="输入任意文字"><button id="btn" type="button">读取输入框</button><ul id="list"><li>标题</li><li>按钮</li><li>输入框</li></ul><p id="result" class="output" aria-live="polite">打开 F12 → Console 查看选中的元素。</p>`,
  raw`// # 匹配 id；querySelector 只返回第一个匹配元素。
const title = document.querySelector('#title');
const btn = document.querySelector('#btn');
const input = document.querySelector('#name');
const list = document.querySelector('#list');
// querySelectorAll 返回所有匹配元素组成的 NodeList。
const items = document.querySelectorAll('#list li');
console.log('标题：', title, '按钮：', btn, '输入框：', input, '列表：', list);
items.forEach(function (item, index) {
  console.log('第 ' + (index + 1) + ' 个列表项：', item);
});
title.textContent = '新标题';
btn.addEventListener('click', function () {
  document.querySelector('#result').textContent = input.value || '你还没有输入文字。';
});`, '试着把 #title 换成 h2，观察是否仍然能选中标题。');

lesson('控制内容和样式', '用 textContent、classList 和 hidden 控制页面。',
  ['点击按钮修改文字。', '颜色和字号可以反复切换。', '隐藏标题后仍然可以用按钮显示它。'],
  `<div class="output"><h2 id="title">今天开始学习 DOM</h2></div><div class="row"><button id="text">修改文字</button><button id="color">切换红色</button><button id="size">切换大字</button><button id="visible" aria-pressed="false">隐藏标题</button></div>`,
  raw`const title = document.querySelector('#title');
document.querySelector('#text').addEventListener('click', function () {
  title.textContent = '我会修改页面文字了！';
});
document.querySelector('#color').addEventListener('click', function () {
  title.classList.toggle('active'); // .active 的红色定义在 styles.css 中
});
document.querySelector('#size').addEventListener('click', function () {
  title.classList.toggle('large');
});
const visibleBtn = document.querySelector('#visible');
visibleBtn.addEventListener('click', function () {
  title.hidden = !title.hidden;
  visibleBtn.textContent = title.hidden ? '显示标题' : '隐藏标题';
  visibleBtn.setAttribute('aria-pressed', String(title.hidden));
});`, 'classList.toggle 会在存在 class 时移除它，不存在时添加它。');

lesson('点击事件', '用 addEventListener("click") 驱动四种常见交互。',
  ['计数器可增加、归零。', '点赞和开关可切换状态。', '详情可展开、收起。'],
  `<h3>计数器</h3><p id="count" class="counter" aria-live="polite">0</p><div class="row"><button id="add">加 1</button><button id="reset" class="secondary">归零</button></div><h3>点赞与开关</h3><div class="row"><button id="like" aria-pressed="false">♡ 点赞 0</button><button id="switch" aria-pressed="false">开关：关</button></div><h3>展开与收起</h3><button id="expand" aria-expanded="false" aria-controls="detail">展开详情</button><p id="detail" class="output" hidden>事件监听器会在用户点击时执行回调函数。</p>`,
  raw`let count = 0;
const countElement = document.querySelector('#count');
document.querySelector('#add').addEventListener('click', function () {
  count++;
  countElement.textContent = count;
});
document.querySelector('#reset').addEventListener('click', function () {
  count = 0;
  countElement.textContent = count;
});
let liked = false;
const likeBtn = document.querySelector('#like');
likeBtn.addEventListener('click', function () {
  liked = !liked;
  likeBtn.textContent = liked ? '♥ 已点赞 1' : '♡ 点赞 0';
  likeBtn.setAttribute('aria-pressed', String(liked));
});
let on = false;
const switchBtn = document.querySelector('#switch');
switchBtn.addEventListener('click', function () {
  on = !on;
  switchBtn.textContent = on ? '开关：开' : '开关：关';
  switchBtn.setAttribute('aria-pressed', String(on));
});
const expandBtn = document.querySelector('#expand');
const detail = document.querySelector('#detail');
expandBtn.addEventListener('click', function () {
  detail.hidden = !detail.hidden;
  expandBtn.textContent = detail.hidden ? '展开详情' : '收起详情';
  expandBtn.setAttribute('aria-expanded', String(!detail.hidden));
});`, '变量保存状态，事件改变状态，再把新状态显示到页面。');

lesson('输入框事件', '监听 input 事件，读取 input.value。',
  ['输入内容实时显示。', '输入名字后显示欢迎语。', '密码不足 6 位时提示，并可清空全部输入。'],
  `<label for="text">实时文字</label><input id="text" placeholder="试着输入一段文字"><p id="mirror" class="output" aria-live="polite">你还没有输入文字。</p><label for="name">你的名字</label><input id="name" autocomplete="off"><p id="welcome" class="status" aria-live="polite">请输入名字。</p><label for="password">练习密码（至少 6 位）</label><input id="password" type="password" autocomplete="off" aria-describedby="password-tip"><p id="password-tip" class="status" aria-live="polite">请输入练习密码。</p><button id="clear" class="secondary">清空输入框</button>`,
  raw`const text = document.querySelector('#text');
const nameInput = document.querySelector('#name');
const password = document.querySelector('#password');
function render() {
  document.querySelector('#mirror').textContent = text.value || '你还没有输入文字。';
  const name = nameInput.value.trim();
  document.querySelector('#welcome').textContent = name ? '欢迎你，' + name + '！' : '请输入名字。';
  const length = password.value.length;
  const tip = document.querySelector('#password-tip');
  tip.textContent = length === 0 ? '请输入练习密码。' : length < 6 ? '长度 ' + length + '：还需要 ' + (6 - length) + ' 位。' : '长度 ' + length + '：长度合格。';
  tip.classList.toggle('error', length > 0 && length < 6);
}
[text, nameInput, password].forEach(function (input) {
  input.addEventListener('input', render);
});
document.querySelector('#clear').addEventListener('click', function () {
  text.value = '';
  nameInput.value = '';
  password.value = '';
  // 通过代码修改 value 不会自动触发 input，所以手动更新页面。
  render();
  text.focus();
});`, 'value 是输入框的值；textContent 是元素内部显示的文字。');

lesson('表单事件', '用 submit 和 preventDefault 编写前端校验。',
  ['空用户名、空密码分别提示。', '密码少于 6 位不能通过。', '合法输入显示成功提示，页面不会刷新。'],
  `<p class="note">仅演示前端校验，不会发送登录请求。请使用随意编写的练习密码。</p><form id="login" novalidate><label for="username">用户名</label><input id="username" autocomplete="off" aria-describedby="username-error"><p id="username-error" class="status error"></p><label for="password">练习密码</label><input id="password" type="password" autocomplete="off" aria-describedby="password-error"><p id="password-error" class="status error"></p><button type="submit">提交表单</button><p id="result" class="status" role="status"></p></form>`,
  raw`const form = document.querySelector('#login');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
form.addEventListener('submit', function (event) {
  event.preventDefault(); // 阻止表单默认提交和页面刷新
  const name = username.value.trim();
  const nameError = name ? '' : '用户名不能为空。';
  const passwordError = password.value.length === 0 ? '密码不能为空。' : password.value.length < 6 ? '密码至少需要 6 位。' : '';
  document.querySelector('#username-error').textContent = nameError;
  document.querySelector('#password-error').textContent = passwordError;
  username.setAttribute('aria-invalid', String(Boolean(nameError)));
  password.setAttribute('aria-invalid', String(Boolean(passwordError)));
  const result = document.querySelector('#result');
  if (nameError || passwordError) {
    result.textContent = '请修正上方提示后重新提交。';
    (nameError ? username : password).focus();
    return;
  }
  result.textContent = '提交成功，欢迎你，' + name + '！（前端校验演示）';
});`, 'form 上监听 submit，也能处理在输入框里按回车提交的情况。');

lesson('个人资料编辑器', '把输入、点击、表单和样式切换组合成一个小项目。',
  ['填写昵称和简介，保存后更新资料卡。', '空昵称不能保存；多行简介保留换行。', '深色模式可以来回切换。'],
  `<form id="profile-form"><label for="nickname">昵称</label><input id="nickname" maxlength="30" value="JavaScript 学习者"><label for="bio">简介</label><textarea id="bio" maxlength="300">每天练习一点点。</textarea><div class="row"><button type="submit">保存资料</button><button id="theme" type="button" class="secondary" aria-pressed="false">切换深色模式</button></div><p id="message" class="status" role="status"></p></form><article class="output" aria-live="polite"><h3 id="display-name" class="profile-name">JavaScript 学习者</h3><p id="display-bio" class="preserve-lines">每天练习一点点。</p></article><p class="muted">本练习保存到页面内存，刷新后恢复初始资料。</p>`,
  raw`const nickname = document.querySelector('#nickname');
const bio = document.querySelector('#bio');
document.querySelector('#profile-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const name = nickname.value.trim();
  const message = document.querySelector('#message');
  message.classList.toggle('error', !name);
  if (!name) {
    message.textContent = '昵称不能为空。';
    nickname.focus();
    return;
  }
  // 用户输入用 textContent 显示，不会被解释成 HTML。
  document.querySelector('#display-name').textContent = name;
  document.querySelector('#display-bio').textContent = bio.value.trim() || '这个人还没有填写简介。';
  message.textContent = '资料已保存到当前页面。';
});
const themeBtn = document.querySelector('#theme');
themeBtn.addEventListener('click', function () {
  const dark = document.body.classList.toggle('dark');
  themeBtn.textContent = dark ? '切换浅色模式' : '切换深色模式';
  themeBtn.setAttribute('aria-pressed', String(dark));
});`, '先实现保存，再加校验，最后添加主题切换。一次只验证一个功能。');

lesson('第一周复盘', '先不看代码，独立重写第一周全部小功能。',
  ['选中并打印元素；修改文字、红色、字号、隐藏状态。', '重写计数器、点赞、开关和展开收起。', '重写实时文字、欢迎语、密码长度和清空。', '表单拦截提交，分别校验空值和短密码。', '重写第 6 天资料编辑器与深色模式。'],
  `<p class="note">先在自己的空白文件中完成右侧清单，再展开下面的参考演示。完整的个人资料编辑器可回到第 6 天核对。</p><details id="review-demo"><summary>完成后展开：第一周参考演示</summary><h2 id="title">复盘标题</h2><div class="row"><button id="text">改文字</button><button id="color">变红</button><button id="size">变大</button><button id="visible">隐藏/显示</button></div><p id="count" class="counter">0</p><div class="row"><button id="add">加 1</button><button id="reset">归零</button><button id="like" aria-pressed="false">点赞 0</button><button id="switch" aria-pressed="false">开关：关</button><button id="expand" aria-expanded="false" aria-controls="detail">展开/收起</button></div><p id="detail" hidden>这段详情可以收起。</p><form id="review-form" novalidate><label for="text-input">实时文字</label><input id="text-input"><p id="mirror" class="output"></p><label for="name">名字</label><input id="name"><p id="welcome" class="status"></p><label for="password">练习密码</label><input id="password" type="password" autocomplete="off"><p id="length" class="status"></p><div class="row"><button type="submit">校验提交</button><button type="button" id="clear">清空</button></div><p id="result" role="status"></p></form><a href="../day-06/index.html">第 6 天：资料编辑器与深色模式 →</a></details>`,
  raw`const title = document.querySelector('#title');
console.log('复盘元素：', title, document.querySelectorAll('button'), document.querySelector('#name'));
document.querySelector('#text').addEventListener('click', function () { title.textContent = '我完成了第一周！'; });
document.querySelector('#color').addEventListener('click', function () { title.classList.toggle('active'); });
document.querySelector('#size').addEventListener('click', function () { title.classList.toggle('large'); });
document.querySelector('#visible').addEventListener('click', function () { title.hidden = !title.hidden; });
let count = 0;
document.querySelector('#add').addEventListener('click', function () { document.querySelector('#count').textContent = ++count; });
document.querySelector('#reset').addEventListener('click', function () { count = 0; document.querySelector('#count').textContent = count; });
let liked = false;
const like = document.querySelector('#like');
like.addEventListener('click', function () {
  liked = !liked;
  like.textContent = liked ? '已点赞 1' : '点赞 0';
  like.setAttribute('aria-pressed', String(liked));
});
let on = false;
const switchBtn = document.querySelector('#switch');
switchBtn.addEventListener('click', function () {
  on = !on;
  switchBtn.textContent = on ? '开关：开' : '开关：关';
  switchBtn.setAttribute('aria-pressed', String(on));
});
const detail = document.querySelector('#detail');
document.querySelector('#expand').addEventListener('click', function (event) {
  detail.hidden = !detail.hidden;
  event.currentTarget.setAttribute('aria-expanded', String(!detail.hidden));
});
const text = document.querySelector('#text-input');
const nameInput = document.querySelector('#name');
const password = document.querySelector('#password');
function renderInputs() {
  document.querySelector('#mirror').textContent = text.value || '请输入文字。';
  document.querySelector('#welcome').textContent = nameInput.value.trim() ? '欢迎你，' + nameInput.value.trim() + '！' : '请输入名字。';
  document.querySelector('#length').textContent = password.value.length >= 6 ? '长度合格。' : '密码至少需要 6 位，当前 ' + password.value.length + ' 位。';
}
[text, nameInput, password].forEach(function (input) { input.addEventListener('input', renderInputs); });
document.querySelector('#clear').addEventListener('click', function () {
  [text, nameInput, password].forEach(function (input) { input.value = ''; });
  document.querySelector('#result').textContent = '';
  renderInputs();
});
document.querySelector('#review-form').addEventListener('submit', function (event) {
  event.preventDefault();
  let message = '提交成功！（前端演示）';
  if (!nameInput.value.trim()) message = '名字不能为空。';
  else if (!password.value) message = '密码不能为空。';
  else if (password.value.length < 6) message = '密码至少需要 6 位。';
  document.querySelector('#result').textContent = message;
});
renderInputs();`, '建议合上参考代码，自测每个边界：空输入、连续点击、重复提交。');

lesson('对象与属性', '用对象描述用户，读取并修改对象属性。',
  ['页面显示名字、年龄、身份。', '修改名字后更新资料和对象预览。', '空名字不覆盖原来的名字。'],
  `<div class="output"><h3 id="user-name"></h3><p id="user-info"></p></div><label for="new-name">新名字</label><input id="new-name" placeholder="例如：李四"><div class="row"><button id="save">修改名字</button></div><p id="message" role="status"></p><h3>当前对象</h3><pre id="object"></pre>`,
  raw`const user = { name: '张三', age: 18, role: 'JavaScript 学习者' };
function renderUser() {
  // 点语法和方括号语法都可以读取属性。
  document.querySelector('#user-name').textContent = user.name;
  document.querySelector('#user-info').textContent = user['age'] + ' 岁 · ' + user.role;
  document.querySelector('#object').textContent = JSON.stringify(user, null, 2);
}
document.querySelector('#save').addEventListener('click', function () {
  const name = document.querySelector('#new-name').value.trim();
  if (!name) {
    document.querySelector('#message').textContent = '请输入新名字。';
    return;
  }
  user.name = name; // 修改对象属性之后，需要再次渲染页面。
  renderUser();
  document.querySelector('#message').textContent = '名字已更新。';
});
renderUser();`, '对象适合描述一个事物；属性名说明这个值的含义。');

lesson('数组与列表', '用数组保存多个名字，完成遍历、新增和删除。',
  ['初始显示三个名字。', '输入后回车或点击按钮新增。', '可以按行删除，包括删除最后一项。'],
  `<form id="name-form"><label for="new-name">新增名字</label><div class="row"><input id="new-name" placeholder="请输入名字"><button type="submit">添加名字</button></div></form><p id="message" class="status" role="status"></p><ul id="names" class="list"></ul><pre id="array"></pre>`,
  raw`const names = ['张三', '李四', '王五'];
const list = document.querySelector('#names');
function renderNames() {
  list.replaceChildren(); // 先清空旧列表，防止重复渲染。
  names.forEach(function (name, index) {
    const item = document.createElement('li');
    const row = document.createElement('div');
    row.className = 'row';
    const text = document.createElement('span');
    text.textContent = name;
    const button = document.createElement('button');
    button.textContent = '删除';
    button.className = 'secondary';
    button.setAttribute('aria-label', '删除第 ' + (index + 1) + ' 项 ' + name);
    button.addEventListener('click', function () {
      names.splice(index, 1); // 从 index 开始删除 1 项。
      renderNames();
    });
    row.append(text, button);
    item.append(row);
    list.append(item);
  });
  if (names.length === 0) list.textContent = '列表为空，添加第一个名字吧。';
  document.querySelector('#array').textContent = JSON.stringify(names, null, 2);
}
document.querySelector('#name-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const input = document.querySelector('#new-name');
  const name = input.value.trim();
  if (!name) {
    document.querySelector('#message').textContent = '名字不能为空。';
    return;
  }
  names.push(name);
  renderNames();
  input.value = '';
  input.focus();
  document.querySelector('#message').textContent = '已添加 ' + name + '。';
});
renderNames();`, '数组的下标从 0 开始。重复名字也能按各自的位置独立删除。');

lesson('map 渲染列表', '用 map 把数据变成 HTML 字符串，再用 join 连接。',
  ['商品、用户、文章三类列表都能显示。', '页面不会在列表项之间出现逗号。', '对照源代码理解 map 和 join 分别做什么。'],
  `<h3>商品列表</h3><ul id="products" class="list"></ul><h3>用户列表</h3><ul id="users" class="list"></ul><h3>文章列表</h3><ul id="articles" class="list"></ul><p class="note">本日 innerHTML 只拼接代码中固定的数据；输入框或接口返回的文字请用 textContent 显示。</p>`,
  raw`const products = [{ name: '笔记本', price: 28 }, { name: '台灯', price: 129 }];
const users = [{ name: '张三', role: '设计师' }, { name: '李四', role: '开发者' }];
const articles = [{ title: '认识 DOM', author: '小林' }, { title: '第一个点击事件', author: '小周' }];
// map 返回一个新数组，每项都是一段 HTML；join('') 去掉默认的逗号。
const html = products.map(function (item) {
  return '<li>' + item.name + ' · ¥' + item.price + '</li>';
}).join('');
document.querySelector('#products').innerHTML = html;
document.querySelector('#users').innerHTML = users.map(function (item) {
  return '<li>' + item.name + ' · ' + item.role + '</li>';
}).join('');
document.querySelector('#articles').innerHTML = articles.map(function (item) {
  return '<li>' + item.title + ' · 作者：' + item.author + '</li>';
}).join('');`, '试着去掉 join("")，观察数组被转成字符串时出现的逗号。');

const productData = raw`const products = [
  { id: 1, name: '晨间笔记本', category: '文具', price: 28, sales: 320 },
  { id: 2, name: '阅读台灯', category: '家居', price: 129, sales: 180 },
  { id: 3, name: '无线鼠标', category: '数码', price: 89, sales: 460 },
  { id: 4, name: '机械键盘', category: '数码', price: 299, sales: 260 },
  { id: 5, name: '陶瓷马克杯', category: '家居', price: 59, sales: 510 },
  { id: 6, name: '钢笔套装', category: '文具', price: 159, sales: 95 }
];
`;
const productRender = raw`
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
`;
const categorySelect = `<label for="category">分类</label><select id="category"><option value="all">全部分类</option><option>文具</option><option>家居</option><option>数码</option></select>`;
const sortSelect = `<label for="sort">排序</label><select id="sort"><option value="default">默认顺序</option><option value="price-asc">价格从低到高</option><option value="price-desc">价格从高到低</option><option value="sales">销量从高到低</option></select>`;
const productOutput = `<p id="result-count" class="status" role="status"></p><div id="products" class="cards"></div>`;

lesson('filter 搜索与筛选', '通过返回 true 或 false 决定保留哪些商品。',
  ['按名字搜索商品，前后空格不影响匹配。', '分类和关键词可组合使用。', '勾选后只保留价格大于 100 的商品，支持无结果提示。'],
  `<div class="filters"><div><label for="keyword">搜索商品</label><input id="keyword" type="search" placeholder="试试：键盘"></div><div>${categorySelect}</div></div><label class="check"><input id="expensive" type="checkbox"> 只显示价格大于 ¥100 的商品</label>${productOutput}`,
  productData + productRender + raw`
const keyword = document.querySelector('#keyword');
const category = document.querySelector('#category');
const expensive = document.querySelector('#expensive');
function filterProducts() {
  const word = keyword.value.trim().toLowerCase();
  const filtered = products.filter(function (item) {
    const matchesName = item.name.toLowerCase().includes(word);
    const matchesCategory = category.value === 'all' || item.category === category.value;
    const matchesPrice = !expensive.checked || item.price > 100;
    return matchesName && matchesCategory && matchesPrice;
  });
  renderProducts(filtered);
}
keyword.addEventListener('input', filterProducts);
category.addEventListener('change', filterProducts);
expensive.addEventListener('change', filterProducts);
filterProducts();`, 'filter 不修改原数组。多个条件用 && 表示必须同时满足。');

lesson('sort 排序', '按价格、销量排序，并保留原始数据顺序。',
  ['价格升序从 ¥28 开始，降序从 ¥299 开始。', '销量排序第一项是陶瓷马克杯。', '选择默认顺序后恢复初始列表。'],
  `<div>${sortSelect}</div>${productOutput}`,
  productData + productRender + raw`
const sort = document.querySelector('#sort');
function sortProducts() {
  // sort 会改变数组自身；用展开运算符复制后再排序。
  const sorted = [...products];
  if (sort.value === 'price-asc') sorted.sort(function (a, b) { return a.price - b.price; });
  if (sort.value === 'price-desc') sorted.sort(function (a, b) { return b.price - a.price; });
  if (sort.value === 'sales') sorted.sort(function (a, b) { return b.sales - a.sales; });
  renderProducts(sorted);
}
sort.addEventListener('change', sortProducts);
sortProducts();`, '比较函数返回负数时 a 排在 b 前面。数字排序不要直接用不带比较函数的 sort()。');

lesson('reduce 累加计算', '计算购物车总价、商品数量，以及成绩平均分。',
  ['初始购物车 6 件商品，总价 ¥371.00。', '修改数量时总价、总件数实时变化。', '空购物车显示 0；成绩支持计算和非法输入提示。'],
  `<h3>购物车</h3><ul id="cart" class="list"></ul><p id="cart-total" class="output" aria-live="polite"></p><div class="row"><button id="clear-cart" class="secondary">清空购物车</button><button id="reset-cart" class="secondary">恢复示例</button></div><h3>平均分</h3><form id="score-form"><label for="scores">用逗号分隔 0–100 的成绩</label><input id="scores" value="80, 90, 100"><div class="row"><button type="submit">计算平均分</button></div></form><p id="average" class="status" role="status"></p>`,
  raw`function initialCart() {
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
renderCart();`, 'reduce 的第二个参数 0 是初始累计值，因此空数组也能正确得到 0。');

lesson('商品列表页面', '组合数组渲染、搜索、分类筛选和价格排序。',
  ['默认显示 6 件商品。', '搜索、分类和排序同时生效。', '清空条件可恢复默认列表；没有匹配商品时有提示。'],
  `<div class="filters"><div><label for="keyword">搜索商品</label><input id="keyword" type="search" placeholder="输入商品名称"></div><div>${categorySelect}</div><div>${sortSelect}</div></div><div class="row"><button id="reset" class="secondary">重置条件</button></div>${productOutput}`,
  productData + productRender + raw`
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
updateProducts();`, '数据 → filter → sort → 渲染。不要直接从旧的页面内容里寻找业务数据。');

lesson('定时器', '用 setTimeout 延迟一次，用 setInterval 周期执行。',
  ['点击按钮，3 秒后出现提示。', '设置秒数并开始倒计时，到 0 后停止。', '数字自动在 1–5 之间轮播，停止按钮可以清理定时器。'],
  `<h3>延迟提示</h3><button id="delay">3 秒后显示提示</button><p id="delay-result" class="status" role="status">等待开始。</p><h3>倒计时</h3><label for="seconds">秒数（1–60）</label><input id="seconds" type="number" min="1" max="60" step="1" value="5"><div class="row"><button id="countdown-start">开始 / 重新开始</button></div><p id="countdown" class="counter" aria-live="polite">5</p><h3>数字轮播</h3><p id="slide" class="counter">1</p><div class="row"><button id="carousel-start">开始轮播</button><button id="stop" class="secondary">停止全部定时器</button></div><p id="timer-status" class="status" role="status"></p>`,
  raw`let delayTimer = null;
let countdownTimer = null;
let carouselTimer = null;
const delayBtn = document.querySelector('#delay');
delayBtn.addEventListener('click', function () {
  clearTimeout(delayTimer);
  delayBtn.disabled = true;
  document.querySelector('#delay-result').textContent = '正在等待 3 秒……';
  delayTimer = setTimeout(function () {
    document.querySelector('#delay-result').textContent = '3 秒到了！';
    delayBtn.disabled = false;
    delayTimer = null;
  }, 3000);
});
document.querySelector('#countdown-start').addEventListener('click', function () {
  const seconds = document.querySelector('#seconds').valueAsNumber;
  const status = document.querySelector('#timer-status');
  if (!Number.isInteger(seconds) || seconds < 1 || seconds > 60) {
    status.textContent = '请输入 1–60 的整数秒数。';
    return;
  }
  clearInterval(countdownTimer); // 重复点击不会叠加多个定时器。
  // 用结束时间计算剩余秒数，减少后台标签页限速造成的累计误差。
  const endTime = Date.now() + seconds * 1000;
  document.querySelector('#countdown').textContent = seconds;
  status.textContent = '倒计时进行中。';
  countdownTimer = setInterval(function () {
    const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    document.querySelector('#countdown').textContent = remaining;
    if (remaining === 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      status.textContent = '倒计时结束！';
    }
  }, 200);
});
let slide = 1;
document.querySelector('#carousel-start').addEventListener('click', function () {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(function () {
    slide = slide % 5 + 1;
    document.querySelector('#slide').textContent = slide;
  }, 1000);
  document.querySelector('#timer-status').textContent = '数字轮播已开始。';
});
function stopTimers() {
  clearTimeout(delayTimer);
  clearInterval(countdownTimer);
  clearInterval(carouselTimer);
  if (delayTimer !== null) document.querySelector('#delay-result').textContent = '延迟提示已取消。';
  delayTimer = countdownTimer = carouselTimer = null;
  delayBtn.disabled = false;
}
document.querySelector('#stop').addEventListener('click', function () {
  stopTimers();
  document.querySelector('#timer-status').textContent = '全部定时器已停止。';
});
window.addEventListener('pagehide', stopTimers);`, '保存定时器 ID，才能用 clearTimeout / clearInterval 停止它。');

lesson('Promise：成功与失败', '认识 pending、fulfilled、rejected 三种状态。',
  ['点击成功按钮，先等待，再得到结果。', '点击失败按钮，错误被 catch 捕获。', '成功或失败后，finally 都会恢复按钮。'],
  `<p>这是本地模拟请求，不需要网络。每次约 1 秒后完成。</p><div class="row"><button id="success">模拟成功</button><button id="failure" class="secondary">模拟失败</button></div><p id="promise-state" class="output" role="status">等待开始。</p><ol id="log"></ol>`,
  raw`const successBtn = document.querySelector('#success');
const failureBtn = document.querySelector('#failure');
const state = document.querySelector('#promise-state');
const logList = document.querySelector('#log');
function log(message) {
  const item = document.createElement('li');
  item.textContent = message;
  logList.append(item);
}
function requestData(shouldFail) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (shouldFail) reject(new Error('模拟请求失败。'));
      else resolve({ message: '拿到数据了！' });
    }, 1000);
  });
}
function run(shouldFail) {
  logList.replaceChildren();
  state.textContent = 'pending：等待结果……';
  successBtn.disabled = failureBtn.disabled = true;
  log('1. 发起异步任务。');
  requestData(shouldFail)
    .then(function (data) {
      state.textContent = 'fulfilled：' + data.message;
      log('3. then 处理成功结果。');
    })
    .catch(function (error) {
      state.textContent = 'rejected：' + error.message;
      log('3. catch 处理失败原因。');
    })
    .finally(function () {
      successBtn.disabled = failureBtn.disabled = false;
      log('4. finally 进行收尾。');
    });
  log('2. 请求还没结束，这一行已经执行了。');
}
successBtn.addEventListener('click', function () { run(false); });
failureBtn.addEventListener('click', function () { run(true); });`, 'Promise 只会从 pending 进入一种最终状态，成功和失败不会同时发生。');

lesson('async / await', '用顺序书写的形式处理异步任务。',
  ['等待模拟数据后显示用户资料。', '切换失败选项，错误由 try/catch 处理。', 'finally 恢复按钮，可以再次尝试。'],
  `<p>先用本地 Promise 熟悉 await；下一天再换成真实 fetch。</p><label class="check"><input id="fail" type="checkbox"> 模拟失败</label><div class="row"><button id="load">执行异步函数</button></div><p id="status" class="status" role="status">尚未执行。</p><pre id="data">这里将显示返回的数据。</pre>`,
  raw`// async 函数的返回值会被包装成 Promise。
async function getData(shouldFail) {
  await new Promise(function (resolve) { setTimeout(resolve, 1000); });
  if (shouldFail) throw new Error('模拟数据读取失败。');
  return { name: '张三', age: 18, message: '我学会 await 了！' };
}
const button = document.querySelector('#load');
button.addEventListener('click', async function () {
  const status = document.querySelector('#status');
  const output = document.querySelector('#data');
  const shouldFail = document.querySelector('#fail').checked;
  button.disabled = true;
  status.textContent = '等待异步函数返回数据……';
  output.textContent = '';
  try {
    const data = await getData(shouldFail);
    output.textContent = JSON.stringify(data, null, 2);
    status.textContent = '成功：await 已取得返回值。';
  } catch (error) {
    status.textContent = '失败：' + error.message;
  } finally {
    button.disabled = false;
  }
});`, 'await 暂停的是当前 async 函数后续代码，浏览器仍然可以响应其他交互。');

const userRender = raw`
function renderUsers(users) {
  const list = document.querySelector('#users');
  list.replaceChildren();
  users.forEach(function (user) {
    const item = document.createElement('li');
    const name = document.createElement('h3');
    name.textContent = user.name;
    const email = document.createElement('p');
    email.textContent = user.email;
    const company = document.createElement('small');
    company.textContent = user.company ? user.company.name : '未提供公司信息';
    item.append(name, email, company);
    list.append(item);
  });
}
`;
lesson('fetch 请求用户列表', '请求测试接口，读取 JSON 并渲染用户。',
  ['点击按钮后发起真实 GET 请求。', '成功后显示用户姓名、邮箱和公司。', '失败时有提示，按钮恢复后可以再次请求。'],
  `<p>测试接口：<code>https://jsonplaceholder.typicode.com/users</code></p><button id="load">请求用户列表</button><p id="status" class="status" role="status">需要网络，点击按钮开始。</p><ul id="users" class="list" aria-label="用户列表"></ul>`,
  userRender + raw`
const button = document.querySelector('#load');
const status = document.querySelector('#status');
button.addEventListener('click', async function () {
  button.disabled = true;
  status.textContent = '正在请求用户列表……';
  status.classList.remove('error');
  document.querySelector('#users').replaceChildren();
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    // fetch 遇到 404/500 也可能正常返回，必须检查 HTTP 状态。
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const users = await response.json();
    if (!Array.isArray(users)) throw new Error('接口返回的数据不是数组。');
    renderUsers(users);
    status.textContent = users.length ? '已加载 ' + users.length + ' 位用户。' : '暂时没有用户。';
  } catch (error) {
    status.classList.add('error');
    status.textContent = '请求失败：' + error.message + '。请检查网络后重试。';
  } finally {
    button.disabled = false;
  }
});`, 'fetch 返回 Response；response.json() 也是异步操作，所以需要两次 await。');

lesson('loading 和错误处理', '完整处理加载、成功、失败、超时和重试。',
  ['请求时显示 Loading，并防止重复点击。', '正常请求后显示用户列表，loading 消失。', '失败模式触发真实 HTTP 错误；改回正常模式后可重试。', '网络超过 10 秒无结果时给出超时提示。'],
  `<label for="mode">请求模式</label><select id="mode"><option value="normal">正常接口</option><option value="failure">失败演示（无效接口路径）</option></select><p class="muted">演示失败后，请切回“正常接口”，再点击重试。</p><div class="row"><button id="load">加载用户</button><span id="loading" hidden>Loading · 正在加载……</span></div><p id="request-url" class="note">等待发起请求。</p><p id="status" class="status" role="status">需要网络；请求超时为 10 秒。</p><div id="result-region" aria-busy="false"><ul id="users" class="list" aria-label="用户列表"></ul></div>`,
  userRender + raw`
const button = document.querySelector('#load');
const loading = document.querySelector('#loading');
const status = document.querySelector('#status');
const region = document.querySelector('#result-region');
const mode = document.querySelector('#mode');
button.addEventListener('click', async function () {
  const url = mode.value === 'failure'
    ? 'https://jsonplaceholder.typicode.com/invalid-practice-route'
    : 'https://jsonplaceholder.typicode.com/users';
  const controller = new AbortController();
  const timeout = setTimeout(function () { controller.abort(); }, 10000);
  // 请求前：设置 loading，清除旧数据和旧错误。
  button.disabled = mode.disabled = true;
  loading.hidden = false;
  region.setAttribute('aria-busy', 'true');
  status.classList.remove('error');
  status.textContent = '正在请求，请稍候。';
  document.querySelector('#request-url').textContent = url;
  document.querySelector('#users').replaceChildren();
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error('服务器返回 HTTP ' + response.status);
    const users = await response.json();
    if (!Array.isArray(users)) throw new Error('返回数据格式不正确');
    renderUsers(users);
    status.textContent = users.length ? '加载成功，共 ' + users.length + ' 位用户。' : '请求成功，用户列表为空。';
    button.textContent = '重新加载';
  } catch (error) {
    status.classList.add('error');
    status.textContent = error.name === 'AbortError'
      ? '请求超时（10 秒）。请检查网络后重试。'
      : '加载失败：' + error.message + '。可切换正常接口后重试。';
    button.textContent = '重试请求';
  } finally {
    // 无论成功或失败，都结束 loading 并清理超时定时器。
    clearTimeout(timeout);
    loading.hidden = true;
    button.disabled = mode.disabled = false;
    region.setAttribute('aria-busy', 'false');
  }
});`, '在浏览器开发者工具的 Network 中切换 Offline，也可以验证断网失败，再恢复网络重试。');

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
function folder(day) { return 'day-' + String(day).padStart(2, '0'); }
const weekNames = ['DOM + 事件', '数组对象 + 页面渲染', '异步请求 + API'];
function page(title, content, script = '') {
  return '<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>' + title + ' · JavaScript 练习册</title>\n<link rel="stylesheet" href="' + (script ? '../' : '') + 'styles.css">\n' + (script ? '<script src="script.js" defer></script>\n' : '') + '</head>\n<body>\n' + content + '\n</body>\n</html>\n';
}
lessons.forEach(function (item, index) {
  const day = index + 1;
  const week = Math.floor(index / 7) + 1;
  const directory = path.join(root, folder(day));
  fs.mkdirSync(directory, { recursive: true });
  const html = `<div class="shell">
<header class="topbar"><a class="brand" href="../index.html">JS / 每天一点进步</a><span class="badge">第 ${week} 周 · ${weekNames[week - 1]}</span></header>
<main><div class="lesson-head"><p class="eyebrow">DAY ${String(day).padStart(2, '0')} / 19</p><h1>${item.title}</h1><p class="muted">${item.goal}</p></div>
<div class="lesson-layout"><div><section class="panel" aria-label="交互练习">${item.html}</section>
<section class="panel"><h2>理解这一步</h2><p>${escapeHtml(item.tip)}</p><details><summary>查看本日参考代码</summary><p class="muted">文件：${folder(day)}/script.js。以下为初始参考答案；修改后的代码以编辑器中的文件为准。</p><pre><code>${escapeHtml(item.script)}</code></pre></details></section></div>
<aside class="panel guide"><p class="eyebrow">CHECK YOUR WORK</p><h2>今日自测</h2><ol>${item.tasks.map(function (task) { return '<li>' + escapeHtml(task) + '</li>'; }).join('')}</ol><p class="note">先操作 → 读代码 → 改一改 → 合上答案重写。</p></aside></div>
<nav class="lesson-footer" aria-label="课程导航">${day > 1 ? '<a href="../' + folder(day - 1) + '/index.html">← 第 ' + (day - 1) + ' 天</a>' : '<a href="../index.html">← 返回课程目录</a>'}<a href="../index.html">课程目录</a>${day < lessons.length ? '<a href="../' + folder(day + 1) + '/index.html">第 ' + (day + 1) + ' 天 →</a>' : '<span>已到第 19 天 · 试着独立重写吧</span>'}</nav>
</main><footer>JavaScript 练习册 · 原生 HTML / CSS / JavaScript · 无需框架</footer></div>`;
  fs.writeFileSync(path.join(directory, 'index.html'), page(item.title, html, 'script.js'));
  fs.writeFileSync(path.join(directory, 'script.js'), "'use strict';\n\n" + item.script);
});
const weeks = weekNames.map(function (name, week) {
  const cards = lessons.slice(week * 7, week * 7 + 7).map(function (item, index) {
    const day = week * 7 + index + 1;
    return `<a class="lesson-card" href="${folder(day)}/index.html"><span class="eyebrow">DAY ${String(day).padStart(2, '0')}</span><h3>${item.title}</h3><p>${item.goal}</p><span class="go">开始练习 ↗</span></a>`;
  }).join('\n');
  return `<section class="week"><div class="week-heading"><span class="week-number">0${week + 1}</span><div><span class="eyebrow">第 ${week + 1} 周</span><h2>${name}</h2></div></div><div class="grid">${cards}</div></section>`;
}).join('\n');
const home = `<div class="shell"><header class="topbar"><a class="brand" href="index.html">JS / 每天一点进步</a><span class="badge">19 天 · 19 组可运行练习</span></header><main>
<section class="hero"><div><p class="eyebrow">LEARN BY BUILDING</p><h1>把 JavaScript<br>写进真实的页面。</h1><p>从选中第一个元素，到渲染商品、请求用户数据。每天一个小目标，边操作、边读代码，再亲手重写一遍。</p><div class="row"><a class="button" href="day-01/index.html">从第 1 天开始 →</a><a href="README.md">阅读使用说明</a></div></div><div class="hero-art" aria-hidden="true"><span class="eyebrow">YOUR DAILY PRACTICE</span><strong>{ js }</strong><pre>const progress = '每天一点点';<br>practice();<br>// 从会看到会写。</pre></div></section>
<p class="note">每一天都有交互演示、中文注释和自测清单。第 18、19 天使用公网测试接口，需要网络；其他练习可离线使用。</p>
${weeks}</main><footer>不需要一次学完。今天把一个小功能写明白，就很好。<br>所有示例可在 VS Code 中修改，刷新浏览器即可看到变化。</footer></div>`;
fs.writeFileSync(path.join(root, 'index.html'), page('19 天学习路线', home));
console.log('已生成课程入口和 ' + lessons.length + ' 天的 HTML / JavaScript 文件。');
