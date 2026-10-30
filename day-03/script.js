'use strict';

let count = 0;
const countElement = document.querySelector('#count');
document.querySelector('#add').addEventListener('click', function () {
  count++;
  countElement.textContent = count;
});
document.querySelector('#reset').addEventListener('click', function () {
  count = 0;
  countElement.textContent = count;
});
let liked = false;
const likeBtn = document.querySelector('#like');
likeBtn.addEventListener('click', function () {
  liked = !liked;
  likeBtn.textContent = liked ? '♥ 已点赞 1' : '♡ 点赞 0';
  likeBtn.setAttribute('aria-pressed', String(liked));
});
let on = false;
const switchBtn = document.querySelector('#switch');
switchBtn.addEventListener('click', function () {
  on = !on;
  switchBtn.textContent = on ? '开关：开' : '开关：关';
  switchBtn.setAttribute('aria-pressed', String(on));
});
const expandBtn = document.querySelector('#expand');
const detail = document.querySelector('#detail');
expandBtn.addEventListener('click', function () {
  detail.hidden = !detail.hidden;
  expandBtn.textContent = detail.hidden ? '展开详情' : '收起详情';
  expandBtn.setAttribute('aria-expanded', String(!detail.hidden));
});
