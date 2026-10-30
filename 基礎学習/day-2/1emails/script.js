function updatePreview() {
    // 1. 找到输入框，并读取留言
    let input = document.getElementById("messageInput");
    let message = input.value;

    // 2. 找到预览区域和计数元素
    let preview = document.getElementById("preview");
    let count = document.getElementById("count");

    // 3. 没有内容时显示提示，否则显示留言
    if (message === "") {
        preview.textContent = "还没有留言";
    } else {
        preview.textContent = message;
    }

    // 4. 更新输入长度
    count.textContent = message.length;
}

function clearMessage() {
    // 5. 找到输入框，把输入内容清空
    let input = document.getElementById("messageInput");
    input.value = "";

    // 输入内容被 JS 修改后，手动调用函数更新页面
    updatePreview();
}