'use strict';

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
});
