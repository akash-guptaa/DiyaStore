const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Admin\\Downloads\\WhatsApp Unknown 2026-10-11 at 10.33.47 PM';
const files = fs.readdirSync(srcDir);

console.log('Total files:', files.length);

// Let's print each filename and size
files.forEach((f, idx) => {
  const stat = fs.statSync(path.join(srcDir, f));
  console.log(`${idx + 1}. [${stat.size} bytes] ${f}`);
});
