const fs = require('fs');
let code = fs.readFileSync('add_customer_edit.js', 'utf8');
code = code.replace("content.trim() + '\\\\n'", "content.trim() + '\\n'");
fs.writeFileSync('add_customer_edit.js', code);
