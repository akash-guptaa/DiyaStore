const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const products = [
  {
    id: 'prod_1001',
    productCode: 'DIYA-001',
    name: 'Handcrafted Terracotta Diya Set',
    slug: 'handcrafted-terracotta-diya-set',
    shortDescription: 'Beautiful set of 4 terracotta diyas.',
    description: 'Perfect for Diwali and festive occasions. Made with pure clay.',
    price: 399,
    salePrice: 299,
    categoryId: 'terracotta',
    images: [{ url: 'https://images.unsplash.com/photo-1541818318288-01306b3997db?w=800&q=80', alt: 'Terracotta Diyas', isMain: true, sortOrder: 1 }],
    specifications: {},
    stockQuantity: 50,
    status: 'published',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod_1002',
    productCode: 'DIYA-002',
    name: 'Brass Kuber Diya',
    slug: 'brass-kuber-diya',
    shortDescription: 'Elegant brass diya for daily pooja.',
    description: 'Solid brass construction, long-lasting and premium finish.',
    price: 799,
    salePrice: null,
    categoryId: 'brass',
    images: [{ url: 'https://images.unsplash.com/photo-1604313264669-72f10b7b12d7?w=800&q=80', alt: 'Brass Diya', isMain: true, sortOrder: 1 }],
    specifications: {},
    stockQuantity: 25,
    status: 'published',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod_1003',
    productCode: 'DIYA-003',
    name: 'Designer Lotus Diya',
    slug: 'designer-lotus-diya',
    shortDescription: 'Lotus shaped diya for home decor.',
    description: 'Hand painted lotus diya with intricate details.',
    price: 499,
    salePrice: 450,
    categoryId: 'designer',
    images: [{ url: 'https://images.unsplash.com/photo-1605705307525-24c759600a94?w=800&q=80', alt: 'Lotus Diya', isMain: true, sortOrder: 1 }],
    specifications: {},
    stockQuantity: 15,
    status: 'published',
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(products, null, 2));
fs.writeFileSync(path.join(dataDir, 'orders.json'), JSON.stringify([], null, 2));

console.log('Seeded products.');
