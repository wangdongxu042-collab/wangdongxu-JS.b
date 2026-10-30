'use strict';

const form = document.querySelector('#login');
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
});
