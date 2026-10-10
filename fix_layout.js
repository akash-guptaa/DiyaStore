const fs = require('fs');

let c = fs.readFileSync('src/app/layout.tsx', 'utf8');
c = c.replace(/\\n/g, '\n');
fs.writeFileSync('src/app/layout.tsx', c);
