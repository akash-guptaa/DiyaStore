const fs = require('fs');

let products = [];
if (fs.existsSync('data/products.json')) {
  products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
}

const newProducts = [
  {
    id: "prod_brass001",
    productCode: "BRASS-001",
    name: "Premium Golden Brass Diya",
    slug: "premium-golden-brass-diya",
    shortDescription: "A beautifully crafted traditional Indian brass diya glowing warmly in a festive setting.",
    description: "Experience the timeless elegance of this heavy-weight premium brass diya. Perfect for daily puja rituals or as a centerpiece for your festive decorations. Intricately carved by traditional artisans, this diya can hold enough oil to burn continuously for several hours.",
    price: 899,
    salePrice: 699,
    categoryId: "brass",
    images: [{ url: "/uploads/premium_brass_diya.jpg", alt: "Premium Brass Diya", isMain: true, sortOrder: 0 }],
    specifications: {},
    stockQuantity: 45,
    status: "published",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod_terra001",
    productCode: "TERRA-001",
    name: "Handmade Terracotta Rangoli Diya Set",
    slug: "handmade-terracotta-rangoli-diya-set",
    shortDescription: "A collection of beautiful handmade terracotta clay diyas, intricately painted with bright festive colors.",
    description: "Bring authentic Indian tradition to your doorstep with this vibrant set of hand-painted terracotta clay diyas. Each diya is individually crafted and embedded with small reflective mirrors that sparkle beautifully when lit. Perfect for Diwali and other major festivals.",
    price: 399,
    salePrice: null,
    categoryId: "terracotta",
    images: [{ url: "/uploads/terracotta_diya.jpg", alt: "Terracotta Diya Set", isMain: true, sortOrder: 0 }],
    specifications: {},
    stockQuantity: 120,
    status: "published",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod_design001",
    productCode: "DSGN-001",
    name: "Modern Glass & Gold Tealight Holders",
    slug: "modern-glass-gold-tealight-holders",
    shortDescription: "A set of modern elegant designer diyas made of gold-plated metal and glass.",
    description: "Blend tradition with contemporary luxury. These modern designer tealight holders are crafted with geometric gold-plated metal framing and clear glass panes. When lit, they cast a breathtaking warm geometric shadow across your living space. Ideal for luxury gifting.",
    price: 1499,
    salePrice: 1299,
    categoryId: "designer",
    images: [{ url: "/uploads/designer_diya_set.jpg", alt: "Designer Glass Tealight Holders", isMain: true, sortOrder: 0 }],
    specifications: {},
    stockQuantity: 25,
    status: "published",
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Add if not exist
newProducts.forEach(np => {
  if (!products.find(p => p.id === np.id)) {
    products.push(np);
  }
});

fs.writeFileSync('data/products.json', JSON.stringify(products, null, 2));
console.log("Added AI generated products!");
