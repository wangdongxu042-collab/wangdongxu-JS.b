function calculateTotal(price, quantity) {
    // 1. 用 let 定义 total，保存总价
    let total = price * quantity;

    // 2. 总价达到 100 元时，打九折
    if (total >= 100) {
        total = total * 0.9;
    }

    // 3. 输出 total
    console.log(total);
}

calculateTotal(20, 3);  // 应输出 60
calculateTotal(25, 4);  // 应输出 90
calculateTotal(50, 3);  // 应输出 135
