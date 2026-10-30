'use strict';

const user = { name: '张三', age: 18, role: 'JavaScript 学习者' };
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
renderUser();
