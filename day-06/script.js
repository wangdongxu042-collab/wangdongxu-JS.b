'use strict';

const nickname = document.querySelector('#nickname');
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
});
