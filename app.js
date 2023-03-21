const fs = require("fs");

// 1. อ่านไฟล์ แล้วจัดรูปแบบข้อมูลให้เป็น obj
// 2. วนลูปตามลำดับของการซื้อขาย
// 2.1 และหากมีการขายเหรียญ ให้ขายจำนวนเหรียญนั้นๆ ตามลำดับที่ซื้อมาก่อนหน้า หากไม่พอขายให้แสดงข้อความ error และหยุดการทำงาน

// 2.2 หากขายเหรียญได้ครบแล้ว ให้คำนวณกำไร/ขาดทุนจากการขายแต่ละครั้ง และเพิ่มค่ากำไร/ขาดทุนรวม
// 3. แสดงผลค่ากำไร/ขาดทุนรวมทั้งหมด

// อ่านไฟล์ crypto_tax.txt
const data = fs.readFileSync("crypto_tax.txt", "utf8");

// แยกแต่ละบรรทัดและสร้าง array
const rows = data.trim().split("\n");
// console.log(rows);

// สร้าง object แยกตามชื่อเหรียญ โดยเก็บรายการซื้อแยกตามแต่ละชุด
const coinData = {};

// คำนวณค่ากำไร/ขาดทุนรวม
let totalProfit = 0;

// วนลูปผ่านแต่ละบรรทัด
for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  const cols = row.split(" ");

  const action = cols[0];
  const coin = cols[1];
  const price = parseFloat(cols[2]);
  const qty = parseFloat(cols[3]);

  // เช็คว่าเหรียญนี้มีข้อมูลอยู่แล้วหรือไม่
  if (!coinData[coin]) {
    coinData[coin] = [];
  }

  // ถ้าเป็นการซื้อ
  if (action === "B") {
    // เพิ่มรายการซื้อใหม่
    coinData[coin].push({ price: price, qty: qty });
  }
  // ถ้าเป็นการขาย
  else if (action === "S") {
    let remainingQty = qty;
    let profit = 0;

    // วนลูปผ่านรายการซื้อแต่ละรายการ
    for (let j = 0; j < coinData[coin].length; j++) {
      const purchase = coinData[coin][j];
      const purchaseQty = purchase.qty;

      // ถ้ามีเหรียญพอขาย
      if (remainingQty <= purchaseQty) {
        profit += (price - purchase.price) * remainingQty;
        purchase.qty -= remainingQty;
        remainingQty = 0;
        break;
      }
      // ถ้าไม่มีเหรียญพอขาย
      else {
        profit += (price - purchase.price) * purchaseQty;
        remainingQty -= purchaseQty;
        purchase.qty = 0;
      }
    }

    // ถ้าเหรียญไม่เพียงพอขาย
    if (remainingQty > 0) {
      console.log("Error: Not enough coins to sell");
      break;
    }

    // เพิ่มกำไร/ขาดทุนรวม
    totalProfit += profit;
  }
}
// console.log(coinData);
console.log(totalProfit.toFixed(2));
