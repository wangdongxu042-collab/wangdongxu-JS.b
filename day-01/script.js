'use strict';

// # 匹配 id；querySelector 只返回第一个匹配元素。
const title = document.querySelector('#title');
const btn = document.querySelector('#btn');
const input = document.querySelector('#name');
const list = document.querySelector('#list');
// querySelectorAll 返回所有匹配元素组成的 NodeList。
const items = document.querySelectorAll('#list li');
console.log('标题：', title, '按钮：', btn, '输入框：', input, '列表：', list);
items.forEach(function (item, index) {
  console.log('第 ' + (index + 1) + ' 个列表项：', item);
});
title.textContent = '新标题';
btn.addEventListener('click', function () {
  document.querySelector('#result').textContent = input.value || '你还没有输入文字。';
});
