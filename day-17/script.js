'use strict';

// async 函数的返回值会被包装成 Promise。
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
});
