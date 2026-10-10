const fs = require('fs');

// PRODUCTS
let products = fs.readFileSync('src/app/admin/products/page.tsx', 'utf8');

const productsExportLogic = `
  const exportCSV = () => {
    const headers = ['Code', 'Name', 'Price', 'Sale Price', 'Stock', 'Status'];
    const rows = products.map(p => [p.productCode, p.name, p.price, p.salePrice || '', p.stockQuantity, p.status]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
`;

products = products.replace('const handleDelete =', productsExportLogic + '\\n  const handleDelete =');
products = products.replace(
  '<button onClick={openAddModal} className="bg-rose-700 text-white px-6 py-2 rounded font-medium hover:bg-rose-800 transition-colors shadow-sm">', 
  '<button onClick={exportCSV} className="bg-stone-200 text-stone-800 px-4 py-2 rounded font-medium hover:bg-stone-300 mr-4">Download CSV</button>\\n        <button onClick={openAddModal} className="bg-rose-700 text-white px-6 py-2 rounded font-medium hover:bg-rose-800 transition-colors shadow-sm">'
);
fs.writeFileSync('src/app/admin/products/page.tsx', products);

// ORDERS
let orders = fs.readFileSync('src/app/admin/orders/page.tsx', 'utf8');

const ordersExportLogic = `
  const exportCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Mobile', 'Total Amount', 'Status', 'Date'];
    const rows = orders.map(o => [o.id, o.customerName, o.customerMobile, o.total, o.status, new Date(o.createdAt || Date.now()).toLocaleDateString()]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
`;

orders = orders.replace('const handleNotifyWhatsApp =', ordersExportLogic + '\\n  const handleNotifyWhatsApp =');
orders = orders.replace(
  '<h1 className="text-2xl font-bold mb-6">Orders</h1>', 
  '<div className="flex justify-between items-center mb-6">\\n        <h1 className="text-2xl font-bold">Orders</h1>\\n        <button onClick={exportCSV} className="bg-stone-200 text-stone-800 px-4 py-2 rounded font-medium hover:bg-stone-300">Download CSV</button>\\n      </div>'
);
fs.writeFileSync('src/app/admin/orders/page.tsx', orders);

console.log('Orders and Products CSV export applied.');
