const fs = require('fs');
let code = fs.readFileSync('src/app/checkout/page.tsx', 'utf8');
code = code.replace('window.location.href = whatsappUrl;', "window.open(whatsappUrl, '_blank'); window.location.href = '/profile';");
fs.writeFileSync('src/app/checkout/page.tsx', code);
