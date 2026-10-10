const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\n  const/g, '\n  const');
  content = content.replace(/\\n        <button/g, '\n        <button');
  content = content.replace(/\\n      <\/div>/g, '\n      </div>');
  fs.writeFileSync(file, content);
}

fixFile('src/app/admin/orders/page.tsx');
fixFile('src/app/admin/products/page.tsx');
