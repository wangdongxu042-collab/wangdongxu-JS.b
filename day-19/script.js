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
});
