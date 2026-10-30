'use strict';

const names = ['张三', '李四', '王五'];
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
renderNames();
