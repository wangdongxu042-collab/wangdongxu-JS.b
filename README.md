# JavaScript · 19 天练习

按你的计划完成第 1–19 天。每一天都有独立 HTML 页面和带中文注释的 `script.js`，不使用框架，也不需要安装依赖。

## 打开方式

直接双击根目录 `index.html`，再选择当天练习。第 18、19 天请求公网测试接口，需要网络；如果浏览器限制本地文件的网络请求，请使用下面的本地服务。

在 VS Code 终端中执行：

```powershell
node server.cjs
```

浏览器打开 http://127.0.0.1:5173 。按 `Ctrl+C` 停止服务。

## 怎样学习

1. 打开当天页面，先操作一次，观察输入和输出。
2. 在 VS Code 打开 `day-XX/index.html` 和 `day-XX/script.js`，对照中文注释阅读。
3. 修改脚本，刷新浏览器，验证自己的理解。按 `F12` → Console 查看日志。
4. 合上答案，在独立文件夹里重写；当天页面右侧有自测要求。
5. 第 7 天先只看验收清单，完成后再展开参考实现。

页面下方的“查看本日参考代码”可直接展开当天 JavaScript。页面代码与 `script.js` 来自同一份内容。

## 课程目录

| 天 | 内容 | 文件夹 |
| --- | --- | --- |
| 1 | querySelector / querySelectorAll，打印元素，修改标题 | day-01 |
| 2 | 文字、颜色、字号、隐藏与显示 | day-02 |
| 3 | 计数器、点赞、开关、展开收起 | day-03 |
| 4 | 实时输入、欢迎语、密码长度、清空 | day-04 |
| 5 | submit、preventDefault、表单校验 | day-05 |
| 6 | 个人资料编辑器、深色模式 | day-06 |
| 7 | 第一周自测清单和独立参考实现 | day-07 |
| 8 | 对象属性读取、修改、渲染 | day-08 |
| 9 | 数组遍历、新增、删除 | day-09 |
| 10 | map + join 渲染商品、用户、文章 | day-10 |
| 11 | filter 关键词、分类、价格筛选 | day-11 |
| 12 | sort 价格升降序、销量排序 | day-12 |
| 13 | reduce 总价、数量、平均分 | day-13 |
| 14 | 商品列表：搜索 + 分类 + 排序 | day-14 |
| 15 | setTimeout、倒计时、数字轮播、停止与清理 | day-15 |
| 16 | Promise 成功、失败、then/catch/finally | day-16 |
| 17 | async/await、返回值与 try/catch | day-17 |
| 18 | fetch 获取并展示用户列表 | day-18 |
| 19 | loading、错误提示、超时、重试 | day-19 |

## 几个需要理解的点

- `querySelector` 返回第一个匹配元素；`querySelectorAll` 返回 NodeList，可用 `forEach` 遍历。
- 用 `textContent` 显示输入内容，避免把用户输入当成 HTML。第 10 天的 `innerHTML` 仅用于固定的练习数据。
- `sort()` 会修改原数组；示例先用 `[...products]` 复制。
- `reduce()` 指定初始值；空购物车总价为 0，空成绩列表单独处理平均分。
- `fetch()` 遇到 HTTP 404/500 不会自动 reject，所以要检查 `response.ok`。
- 第 16、17 天使用本地延迟模拟异步；第 18、19 天真实请求 `https://jsonplaceholder.typicode.com/users`。
- 第 19 天失败模式会请求测试接口的无效路径，真实触发 HTTP 错误；超时为 10 秒，恢复正常请求后可重试。
- 登录表单只是前端校验演示，没有后端登录；个人资料保存在当前页面内，刷新后恢复默认值。
- 所有密码框只检查长度，不输出密码，也不发送登录信息。
- 你的原提示里第 4、17 天的代码语言标签写成了 Lua / C#，这里均已按 JavaScript 实现。
