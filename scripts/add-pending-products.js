const fs = require('fs');
const path = require('path');

const productsPath = path.resolve('data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const now = new Date().toISOString();

const newProducts = [
  {
    id: "prod_na_pack_15",
    productCode: "NA-PACK-15",
    name: "Handcrafted Royal Paisley Kairi Terracotta Diya Pack (Set of 4)",
    slug: "handcrafted-royal-paisley-kairi-terracotta-diya-pack-set-of-4",
    shortDescription: "Traditional mango/kairi-shaped earthen diyas hand-painted in red with green floral interior & center mirror.",
    description: "Crafted from pure riverbed terracotta clay, this set of 4 auspicious paisley-shaped diyas features high-gloss festive red enamel, intricate green floral petals, bright yellow swirl borders, and central reflective glass mirrors that amplify candlelight across your Diwali rangoli.",
    price: 249,
    salePrice: 179,
    inventoryPrice: 65,
    categoryId: "terracotta",
    badge: "New Arrival",
    images: [
      {
        url: "/uploads/royal_paisley_kairi_diya_1.jpg",
        alt: "Handcrafted Royal Paisley Kairi Terracotta Diya Pack",
        isMain: true,
        sortOrder: 0
      }
    ],
    specifications: {
      "Quantity": "Pack of 4 Diyas",
      "Material": "Natural Terracotta Clay",
      "Design": "Traditional Paisley / Mango Motif",
      "Centerpiece": "Reflective Glass Mirror"
    },
    stockQuantity: 50,
    status: "published",
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_na_pack_16",
    productCode: "NA-PACK-16",
    name: "Festive Saffron Floral Blue Kundan Terracotta Diya Pack (Set of 4)",
    slug: "festive-saffron-floral-blue-kundan-terracotta-diya-pack-set-of-4",
    shortDescription: "Vibrant saffron orange clay diyas with 8-petal white/green floral art and sparkling sapphire blue crystal stone.",
    description: "Infuse warmth into your festive decor with these radiant saffron orange terracotta diyas. Decorated with fine eight-petal floral line work in white and emerald green, raised beaded rims, and a brilliant sapphire-blue kundan gem embedded in the center wick well.",
    price: 249,
    salePrice: 179,
    inventoryPrice: 65,
    categoryId: "terracotta",
    badge: "Best Value",
    images: [
      {
        url: "/uploads/saffron_floral_blue_kundan_diya_1.jpg",
        alt: "Festive Saffron Floral Blue Kundan Terracotta Diya Pack",
        isMain: true,
        sortOrder: 0
      }
    ],
    specifications: {
      "Quantity": "Pack of 4 Diyas",
      "Material": "Terracotta Clay",
      "Color": "Saffron Orange with Emerald & White",
      "Centerpiece": "Faceted Sapphire Blue Kundan Gem"
    },
    stockQuantity: 50,
    status: "published",
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_na_box_17",
    productCode: "NA-BOX-17",
    name: "Yellow Emerald Starlight Terracotta Diya Luxury Gift Box (Set of 4)",
    slug: "yellow-emerald-starlight-terracotta-diya-luxury-gift-box-set-of-4",
    shortDescription: "Artistic petal clay diyas with yellow sunray backdrop and studded emerald green rhinestones in luxury box.",
    description: "Presented in a golden satin gift presentation box, this luxury set includes four large flared petal terracotta diyas with warm yellow sunray paintwork, dual-tone magenta floral inner accents, and sparkling emerald green crystal studs along the scalloped edge.",
    price: 349,
    salePrice: 249,
    inventoryPrice: 90,
    categoryId: "designer",
    badge: "Best Sale",
    images: [
      {
        url: "/uploads/yellow_emerald_starlight_box_1.jpg",
        alt: "Yellow Emerald Starlight Diya Luxury Gift Box",
        isMain: true,
        sortOrder: 0
      }
    ],
    specifications: {
      "Quantity": "Set of 4 in Window Presentation Box",
      "Material": "Terracotta Clay & Glass Rhinestones",
      "Finish": "High-Gloss Lacquered Enamel"
    },
    stockQuantity: 40,
    status: "published",
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_na_box_18",
    productCode: "NA-BOX-18",
    name: "Royal Purple Spiral Glitter Diya Luxury Gift Box (Set of 4)",
    slug: "royal-purple-spiral-glitter-diya-luxury-gift-box-set-of-4",
    shortDescription: "Concentric spiral diyas in royal purple and magenta with lime green accents and sparkling silver glitter rim.",
    description: "A stunning visual masterpiece. Each diya is sculpted with swirling concentric spiral ridges finished in royal purple, magenta, and festive lime green, outlined with brilliant silver glitter and a reflective center mirror for double radiance. Packaged in an elegant window presentation box.",
    price: 349,
    salePrice: 249,
    inventoryPrice: 90,
    categoryId: "designer",
    badge: "Best Sale",
    images: [
      {
        url: "/uploads/royal_purple_spiral_glitter_box_1.jpg",
        alt: "Royal Purple Spiral Glitter Diya Luxury Gift Box",
        isMain: true,
        sortOrder: 0
      }
    ],
    specifications: {
      "Quantity": "Set of 4 in Presentation Box",
      "Material": "Terracotta Clay with Glitter",
      "Design": "Concentric Spiral Rangoli",
      "Centerpiece": "Reflective Mirror"
    },
    stockQuantity: 40,
    status: "published",
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_na_box_19",
    productCode: "NA-BOX-19",
    name: "Royal Violet Floral Teardrop Kundan Diya Gift Box (Set of 4)",
    slug: "royal-violet-floral-teardrop-kundan-diya-gift-box-set-of-4",
    shortDescription: "Regal violet teardrop terracotta diyas with hand-painted six-petal floral motifs & center mirror in a luxury box.",
    description: "Elevate your Diwali celebrations with these opulent teardrop terracotta diyas. Finished in rich royal violet enamel with six-petal lotus flower hand-drawings, shimmering center mirror, and white wave beaded rims, housed in a four-compartment gift box.",
    price: 349,
    salePrice: 249,
    inventoryPrice: 90,
    categoryId: "designer",
    badge: "New Arrival",
    images: [
      {
        url: "/uploads/violet_floral_teardrop_box_1.jpg",
        alt: "Royal Violet Floral Teardrop Diya Gift Box",
        isMain: true,
        sortOrder: 0
      }
    ],
    specifications: {
      "Quantity": "Set of 4 in Gift Box",
      "Material": "Terracotta Clay",
      "Color": "Royal Violet & Pearlescent White",
      "Shape": "Teardrop Deep Reservoir"
    },
    stockQuantity: 40,
    status: "published",
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_na_box_20",
    productCode: "NA-BOX-20",
    name: "Radiant Coral Sunburst Floral Diya Luxury Gift Box (Set of 4)",
    slug: "radiant-coral-sunburst-floral-diya-luxury-gift-box-set-of-4",
    shortDescription: "Dual-tone coral pink and lemon yellow round flower diyas with green gems and central mirror in yellow gift box.",
    description: "Radiate joyful festive energy. These four round terracotta diyas feature gradient sunburst petal painting transitioning from coral pink to sunny lemon yellow, framed by green glitter dots and a focal glass mirror. Packaged in a bright festive yellow gift box.",
    price: 349,
    salePrice: 249,
    inventoryPrice: 90,
    categoryId: "designer",
    badge: "Sale in 24 hours",
    images: [
      {
        url: "/uploads/radiant_coral_sunburst_box_1.jpg",
        alt: "Radiant Coral Sunburst Floral Diya Box Set",
        isMain: true,
        sortOrder: 0
      }
    ],
    specifications: {
      "Quantity": "Set of 4 in Presentation Box",
      "Material": "Earthen Clay",
      "Color": "Coral Pink, Sunshine Yellow & Emerald"
    },
    stockQuantity: 40,
    status: "published",
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_na_box_21",
    productCode: "NA-BOX-21",
    name: "Heritage Vibrant Sunflower 6-Diya Wooden Partition Gift Box",
    slug: "heritage-vibrant-sunflower-6-diya-wooden-partition-gift-box",
    shortDescription: "Luxury presentation box with 6 sunflower rangoli clay diyas in radiant yellow, magenta & emerald with mirrors.",
    description: "An extraordinary Diwali centerpiece. This handcrafted wooden partition box features six large multi-wick sunflower diyas hand-painted in gradient magenta, lemon yellow, and emerald green with reflective central glass mirrors that multiply the warm candle flames. Includes two professional display angles.",
    price: 499,
    salePrice: 349,
    inventoryPrice: 120,
    categoryId: "festive",
    badge: "Best Sale",
    images: [
      {
        url: "/uploads/sunflower_6diya_window_box_1.jpg",
        alt: "Heritage Vibrant Sunflower 6-Diya Box Front Shot",
        isMain: true,
        sortOrder: 0
      },
      {
        url: "/uploads/sunflower_6diya_window_box_2.jpg",
        alt: "Heritage Vibrant Sunflower 6-Diya Box Display Angle",
        isMain: false,
        sortOrder: 1
      }
    ],
    specifications: {
      "Quantity": "Set of 6 Diyas in Display Tray",
      "Material": "Terracotta with Center Mirrors",
      "Packaging": "6-Grid Window Presentation Box"
    },
    stockQuantity: 35,
    status: "published",
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  }
];

// Check if any product code already exists to avoid duplicates
newProducts.forEach(np => {
  const existingIdx = products.findIndex(p => p.productCode === np.productCode || p.id === np.id);
  if (existingIdx !== -1) {
    products[existingIdx] = np;
    console.log(`Updated existing product: ${np.productCode} (${np.name})`);
  } else {
    products.push(np);
    console.log(`Added new product: ${np.productCode} (${np.name})`);
  }
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
console.log(`Successfully saved products! Total count: ${products.length}`);
