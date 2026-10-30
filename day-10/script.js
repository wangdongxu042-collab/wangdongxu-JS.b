'use strict';

const products = [{ name: '笔记本', price: 28 }, { name: '台灯', price: 129 }];
const users = [{ name: '张三', role: '设计师' }, { name: '李四', role: '开发者' }];
const articles = [{ title: '认识 DOM', author: '小林' }, { title: '第一个点击事件', author: '小周' }];
// map 返回一个新数组，每项都是一段 HTML；join('') 去掉默认的逗号。
const html = products.map(function (item) {
  return '<li>' + item.name + ' · ¥' + item.price + '</li>';
}).join('');
document.querySelector('#products').innerHTML = html;
document.querySelector('#users').innerHTML = users.map(function (item) {
  return '<li>' + item.name + ' · ' + item.role + '</li>';
}).join('');
document.querySelector('#articles').innerHTML = articles.map(function (item) {
  return '<li>' + item.title + ' · 作者：' + item.author + '</li>';
}).join('');
