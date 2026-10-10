const fs = require('fs');

let code = fs.readFileSync('src/app/admin/orders/page.tsx', 'utf8');

code = code.replace(
  "{o.items?.map((i: any, idx: number) => (",
  "{(o.items || [{ productName: o.productName, quantity: o.quantity }]).map((i: any, idx: number) => ("
);

// also just in case it doesn't have the type annotations:
code = code.replace(
  "{o.items?.map((i, idx) => (",
  "{(o.items || [{ productName: o.productName, quantity: o.quantity }]).map((i: any, idx: number) => ("
);

fs.writeFileSync('src/app/admin/orders/page.tsx', code);
console.log('Fixed admin orders');
