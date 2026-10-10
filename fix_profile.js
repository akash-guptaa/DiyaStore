const fs = require('fs');

let code = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

code = code.replace(
  "{o.items.map((i, idx) => (",
  "{(o.items || [{ productName: o.productName, quantity: o.quantity }]).map((i: any, idx: number) => ("
);

fs.writeFileSync('src/app/profile/page.tsx', code);
console.log('Fixed profile order map');
