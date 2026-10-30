'use strict';

const text = document.querySelector('#text');
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
});
