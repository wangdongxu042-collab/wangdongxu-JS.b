'use strict';

let delayTimer = null;
let countdownTimer = null;
let carouselTimer = null;
const delayBtn = document.querySelector('#delay');
delayBtn.addEventListener('click', function () {
  clearTimeout(delayTimer);
  delayBtn.disabled = true;
  document.querySelector('#delay-result').textContent = '正在等待 3 秒……';
  delayTimer = setTimeout(function () {
    document.querySelector('#delay-result').textContent = '3 秒到了！';
    delayBtn.disabled = false;
    delayTimer = null;
  }, 3000);
});
document.querySelector('#countdown-start').addEventListener('click', function () {
  const seconds = document.querySelector('#seconds').valueAsNumber;
  const status = document.querySelector('#timer-status');
  if (!Number.isInteger(seconds) || seconds < 1 || seconds > 60) {
    status.textContent = '请输入 1–60 的整数秒数。';
    return;
  }
  clearInterval(countdownTimer); // 重复点击不会叠加多个定时器。
  // 用结束时间计算剩余秒数，减少后台标签页限速造成的累计误差。
  const endTime = Date.now() + seconds * 1000;
  document.querySelector('#countdown').textContent = seconds;
  status.textContent = '倒计时进行中。';
  countdownTimer = setInterval(function () {
    const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    document.querySelector('#countdown').textContent = remaining;
    if (remaining === 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      status.textContent = '倒计时结束！';
    }
  }, 200);
});
let slide = 1;
document.querySelector('#carousel-start').addEventListener('click', function () {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(function () {
    slide = slide % 5 + 1;
    document.querySelector('#slide').textContent = slide;
  }, 1000);
  document.querySelector('#timer-status').textContent = '数字轮播已开始。';
});
function stopTimers() {
  clearTimeout(delayTimer);
  clearInterval(countdownTimer);
  clearInterval(carouselTimer);
  if (delayTimer !== null) document.querySelector('#delay-result').textContent = '延迟提示已取消。';
  delayTimer = countdownTimer = carouselTimer = null;
  delayBtn.disabled = false;
}
document.querySelector('#stop').addEventListener('click', function () {
  stopTimers();
  document.querySelector('#timer-status').textContent = '全部定时器已停止。';
});
window.addEventListener('pagehide', stopTimers);
