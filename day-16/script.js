'use strict';

const successBtn = document.querySelector('#success');
const failureBtn = document.querySelector('#failure');
const state = document.querySelector('#promise-state');
const logList = document.querySelector('#log');
function log(message) {
  const item = document.createElement('li');
  item.textContent = message;
  logList.append(item);
}
function requestData(shouldFail) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (shouldFail) reject(new Error('模拟请求失败。'));
      else resolve({ message: '拿到数据了！' });
    }, 1000);
  });
}
function run(shouldFail) {
  logList.replaceChildren();
  state.textContent = 'pending：等待结果……';
  successBtn.disabled = failureBtn.disabled = true;
  log('1. 发起异步任务。');
  requestData(shouldFail)
    .then(function (data) {
      state.textContent = 'fulfilled：' + data.message;
      log('3. then 处理成功结果。');
    })
    .catch(function (error) {
      state.textContent = 'rejected：' + error.message;
      log('3. catch 处理失败原因。');
    })
    .finally(function () {
      successBtn.disabled = failureBtn.disabled = false;
      log('4. finally 进行收尾。');
    });
  log('2. 请求还没结束，这一行已经执行了。');
}
successBtn.addEventListener('click', function () { run(false); });
failureBtn.addEventListener('click', function () { run(true); });
