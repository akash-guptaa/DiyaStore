const fs = require('fs');
function clean(f) {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/\\n/g, '\n');
  fs.writeFileSync(f, c);
}
clean('src/app/admin/customers/page.tsx');
clean('src/app/api/customers/[id]/route.ts');
