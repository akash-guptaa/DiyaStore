const fs = require('fs');

function wrapTryCatch(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /await fs\.promises\.writeFile\(([^,]+),\s*(.+?)\);/g,
    `try { await fs.promises.writeFile($1, $2); } catch (e) { console.error('Failed to write ' + $1, e); }`
  );
  // for sync writes (like mkdirSync)
  content = content.replace(
    /fs\.mkdirSync\(([^,]+),\s*([^)]+)\);/g,
    `try { fs.mkdirSync($1, $2); } catch (e) { console.error('Failed to mkdir ' + $1, e); }`
  );
  content = content.replace(
    /fs\.writeFileSync\(([^,]+),\s*(.+?)\);/g,
    `try { fs.writeFileSync($1, $2); } catch (e) { console.error('Failed to writeSync ' + $1, e); }`
  );
  fs.writeFileSync(filePath, content);
}

wrapTryCatch('src/lib/store.ts');
wrapTryCatch('src/lib/storeCustomers.ts');
wrapTryCatch('src/lib/storeSettings.ts');

console.log('Added robust file system error handling');
