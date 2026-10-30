'use strict';

const title = document.querySelector('#title');
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
});
