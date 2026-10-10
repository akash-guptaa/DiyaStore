const fs = require('fs');
let code = fs.readFileSync('src/app/checkout/page.tsx', 'utf8');

code = code.replace(
  "window.location.href = `https://wa.me/917400422743?text=${encodeURIComponent(text)}`;",
  "window.open(`https://wa.me/917400422743?text=${encodeURIComponent(text)}`, '_blank');\n      window.location.href = '/profile';"
);

fs.writeFileSync('src/app/checkout/page.tsx', code);
console.log('Fixed checkout redirect');
