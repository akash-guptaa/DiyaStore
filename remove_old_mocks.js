const fs = require('fs');
let products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

// Delete the first 3 old placeholder products that have broken/meme images
products = products.filter(p => !['prod_1001', 'prod_1002', 'prod_1003'].includes(p.id));

fs.writeFileSync('data/products.json', JSON.stringify(products, null, 2));
