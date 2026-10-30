'use strict';

const title = document.querySelector('#title');
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
renderInputs();
