const fs = require('fs');
const path = require('path');

// 1. Copy generated images to public/uploads
const brainDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\87eb1601-6f0c-474b-bf50-aff1fe090ecc';
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

const copyMap = [
  { src: 'peacock_brass_diya_1791735854575.jpg', dest: 'peacock_brass_diya.jpg' },
  { src: 'matka_wax_candle_1791735897036.jpg', dest: 'matka_wax_candle.jpg' },
  { src: 'premium_matka_candle_1791735929351.jpg', dest: 'premium_matka_candle.jpg' }
];

for (const item of copyMap) {
  const srcPath = path.join(brainDir, item.src);
  const destPath = path.join(uploadsDir, item.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${item.src} -> ${item.dest}`);
  }
}

// 2. Load existing products
const productsPath = path.join(process.cwd(), 'data', 'products.json');
let products = [];
try {
  products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
} catch (e) {
  products = [];
}

const now = new Date().toISOString();

// 3. Define new stylish products
const newProducts = [
  // 1) Peacock Diya
  {
    id: 'prod_peacock_01',
    productCode: 'PCK-001',
    name: 'Royal Mayur Handcrafted Brass Peacock Diya',
    slug: 'royal-mayur-handcrafted-brass-peacock-diya',
    shortDescription: 'Exquisitely sculpted pure brass peacock diya with detailed feather plume engraving.',
    description: 'Embrace royal heritage with this majestic Mayur (Peacock) Deepam. Hand-cast by generational metal artisans in pure virgin brass, the detailed feathers and regal poise of the peacock elevate any puja alter, Diwali decor, or living room console. Designed for generous oil holding and a radiant steady flame.',
    price: 1299,
    salePrice: 999,
    categoryId: 'brass',
    images: [{ url: '/uploads/peacock_brass_diya.jpg', alt: 'Royal Mayur Brass Peacock Diya', isMain: true, sortOrder: 0 }],
    specifications: { 'Material': 'Pure Brass', 'Finish': 'Antique Golden', 'Weight': '480g' },
    stockQuantity: 50,
    status: 'published',
    featured: true,
    createdAt: now,
    updatedAt: now
  },

  // 2) Matka Mombatti
  {
    id: 'prod_matka_candle_01',
    productCode: 'MC-001',
    name: 'Artisan Terracotta Matka Scented Candle',
    slug: 'artisan-terracotta-matka-scented-candle',
    shortDescription: 'Traditional hand-thrown clay pot filled with organic scented wax and dual wicks.',
    description: 'Add earthy warmth to your celebrations with our authentic Matka Mombatti. Molded from riverbed terracotta clay and hand-painted with festive tribal motifs, each pot is hand-poured with natural slow-burning soy wax infused with delicate mogra and sandalwood fragrance.',
    price: 349,
    salePrice: 249,
    categoryId: 'terracotta',
    images: [{ url: '/uploads/matka_wax_candle.jpg', alt: 'Artisan Terracotta Matka Scented Candle', isMain: true, sortOrder: 0 }],
    specifications: { 'Material': 'Terracotta Clay & Natural Soy Wax', 'Burn Time': '12+ Hours' },
    stockQuantity: 150,
    status: 'published',
    featured: true,
    createdAt: now,
    updatedAt: now
  },

  // 3) Premium Matka Mombatti
  {
    id: 'prod_prem_matka_candle_01',
    productCode: 'PMC-001',
    name: 'Imperial Shahi Zardozi Embellished Matka Candle',
    slug: 'imperial-shahi-zardozi-embellished-matka-candle',
    shortDescription: 'Luxury heirloom pot candle adorned with kundan gems, gold foil, and royal zardozi artistry.',
    description: 'The pinnacle of festive grandeur. This premium matka candle is individually decorated with shimmering faux-kundan stones, gold filigree, and peacock enamel motifs. Filled with high-aroma rose and saffron beeswax blend for an unforgettable, opulent Diwali centerpiece.',
    price: 699,
    salePrice: 499,
    categoryId: 'designer',
    images: [{ url: '/uploads/premium_matka_candle.jpg', alt: 'Imperial Shahi Zardozi Matka Candle', isMain: true, sortOrder: 0 }],
    specifications: { 'Material': 'Clay, Kundan Stones, Scented Wax', 'Burn Time': '18+ Hours' },
    stockQuantity: 80,
    status: 'published',
    featured: true,
    createdAt: now,
    updatedAt: now
  },

  // 4) Matka Diya
  {
    id: 'prod_matka_diya_01',
    productCode: 'MD-001',
    name: 'Traditional Hand-Painted Mitti Matka Diya (Set of 4)',
    slug: 'traditional-hand-painted-mitti-matka-diya-set-4',
    shortDescription: 'Classic miniature earthen pot oil diyas crafted with eco-friendly natural clay.',
    description: 'Celebrate sacred traditions with our handcrafted Mitti Matka Diyas. Designed to hold mustard or sesame oil with cotton wicks, these charming pot-shaped diyas burn cleanly and stably outdoors or indoors, keeping Indian clay pottery heritage glowing bright.',
    price: 299,
    salePrice: 199,
    categoryId: 'terracotta',
    images: [{ url: '/uploads/terracotta_diya.jpg', alt: 'Traditional Hand-Painted Mitti Matka Diya', isMain: true, sortOrder: 0 }],
    specifications: { 'Material': 'Natural Mitti Clay', 'Set Quantity': 'Pack of 4' },
    stockQuantity: 200,
    status: 'published',
    featured: true,
    createdAt: now,
    updatedAt: now
  },

  // 5) Lotus Diya
  {
    id: 'prod_lotus_diya_01',
    productCode: 'LTS-001',
    name: 'Divine Blooming Kamal Lotus Brass Diya',
    slug: 'divine-blooming-kamal-lotus-brass-diya',
    shortDescription: 'Elegantly sculpted multilayered lotus flower diya symbolizing purity, wealth, and prosperity.',
    description: 'Dedicated to Goddess Lakshmi, this divine Kamal Deepam is sculpted in blooming layered petals that cradle sacred oil and wick. The polished brass surface reflects the flame into a mesmerizing golden halo that enriches your mandir and festival entryway.',
    price: 899,
    salePrice: 649,
    categoryId: 'brass',
    images: [{ url: '/uploads/premium_brass_diya.jpg', alt: 'Divine Blooming Lotus Brass Diya', isMain: true, sortOrder: 0 }],
    specifications: { 'Material': 'Solid Brass', 'Diameter': '4.5 inches', 'Finish': 'Lustrous Gold' },
    stockQuantity: 75,
    status: 'published',
    featured: true,
    createdAt: now,
    updatedAt: now
  },

  // 6) Premium Diya - 8 Unique Designs
  // Design 1
  {
    id: 'prod_prem_diya_d1',
    productCode: 'PRM-D01',
    name: 'Imperial Ashtalakshmi Antique Brass Diya (Design 1)',
    slug: 'imperial-ashtalakshmi-antique-brass-diya-design-1',
    shortDescription: 'Sacred eight-fold Lakshmi embossed heavy brass deepam for divine blessings and abundance.',
    description: 'Design 1 of our Signature Premium Series. Featuring the eight divine manifestations of Goddess Lakshmi embossed around the polished oil reservoir, finished with a classic temple finial.',
    price: 1599,
    salePrice: 1299,
    categoryId: 'brass',
    images: [{ url: '/uploads/premium_brass_diya.jpg', alt: 'Imperial Ashtalakshmi Antique Brass Diya', isMain: true, sortOrder: 0 }],
    specifications: { 'Design Variant': '1: Ashtalakshmi Embossed', 'Material': 'Heavy Cast Brass', 'Height': '6 inches' },
    stockQuantity: 40,
    status: 'published',
    featured: true,
    createdAt: now,
    updatedAt: now
  },

  // Design 2
  {
    id: 'prod_prem_diya_d2',
    productCode: 'PRM-D02',
    name: 'Heritage Royal Peacock Multi-Tier Vilakku Diya (Design 2)',
    slug: 'heritage-royal-peacock-multi-tier-vilakku-diya-design-2',
    shortDescription: 'Grand South Indian style standing deepam crowned with a dancing peacock crest.',
    description: 'Design 2 of our Signature Premium Series. An iconic tiered vilakku with five flame notches, crowned with a sculpted dancing peacock that radiates classic temple opulence.',
    price: 1799,
    salePrice: 1449,
    categoryId: 'brass',
    images: [{ url: '/uploads/premium_brass_diya.jpg', alt: 'Heritage Royal Peacock Multi-Tier Vilakku Diya', isMain: true, sortOrder: 0 }],
    specifications: { 'Design Variant': '2: Peacock Vilakku', 'Material': 'Solid Polished Brass', 'Wicks': '5 Notches' },
    stockQuantity: 35,
    status: 'published',
    featured: true,
    createdAt: now,
    updatedAt: now
  },

  // Design 3
  {
    id: 'prod_prem_diya_d3',
    productCode: 'PRM-D03',
    name: 'Vintage Hanging Bell Chain Brass Diya (Design 3)',
    slug: 'vintage-hanging-bell-chain-brass-diya-design-3',
    shortDescription: 'Traditional hanging deepam suspended from an ornate brass link chain with sonic ghungroo bells.',
    description: 'Design 3 of our Signature Premium Series. Designed for doorways and mandir ceilings, this suspended diya tinkles gently with chiming temple bells whenever a breeze passes.',
    price: 1399,
    salePrice: 1099,
    categoryId: 'brass',
    images: [{ url: '/uploads/premium_brass_diya.jpg', alt: 'Vintage Hanging Bell Chain Brass Diya', isMain: true, sortOrder: 0 }],
    specifications: { 'Design Variant': '3: Hanging Chain & Bell', 'Chain Length': '18 inches', 'Material': 'Brass' },
    stockQuantity: 30,
    status: 'published',
    featured: true,
    createdAt: now,
    updatedAt: now
  },

  // Design 4
  {
    id: 'prod_prem_diya_d4',
    productCode: 'PRM-D04',
    name: 'Celestial Surya Akhand Brass Diya with Borosilicate Glass (Design 4)',
    slug: 'celestial-surya-akhand-brass-diya-glass-design-4',
    shortDescription: 'Windproof 24-hour Akhand Jyoti deepam shielded with heat-resistant cylindrical glass chimney.',
    description: 'Design 4 of our Signature Premium Series. Features sun-ray filigree cutwork base and premium borosilicate glass casing to keep your sacred flame burning continuously day and night.',
    price: 1499,
    salePrice: 1199,
    categoryId: 'designer',
    images: [{ url: '/uploads/designer_diya_set.jpg', alt: 'Celestial Surya Akhand Brass Diya', isMain: true, sortOrder: 0 }],
    specifications: { 'Design Variant': '4: Akhand Jyoti Glass Shield', 'Glass': 'High Thermal Borosilicate', 'Base': 'Brass' },
    stockQuantity: 45,
    status: 'published',
    featured: true,
    createdAt: now,
    updatedAt: now
  },

  // Design 5
  {
    id: 'prod_prem_diya_d5',
    productCode: 'PRM-D05',
    name: 'Gilded Royal Aarti Deepam with Rosewood Carved Handle (Design 5)',
    slug: 'gilded-royal-aarti-deepam-rosewood-handle-design-5',
    shortDescription: 'Ceremonial Pancha Aarti lamp with multi-step flame wells and ergonomic heat-safe wooden handle.',
    description: 'Design 5 of our Signature Premium Series. Built specifically for morning and evening aarti rituals, featuring 5 sacred wicks, camphor burner tray, and a balanced polished wooden handle.',
    price: 1299,
    salePrice: 949,
    categoryId: 'brass',
    images: [{ url: '/uploads/premium_brass_diya.jpg', alt: 'Gilded Royal Aarti Deepam', isMain: true, sortOrder: 0 }],
    specifications: { 'Design Variant': '5: Pancha Aarti Handle', 'Handle': 'Insulated Rosewood', 'Material': 'Brass' },
    stockQuantity: 50,
    status: 'published',
    featured: true,
    createdAt: now,
    updatedAt: now
  },

  // Design 6
  {
    id: 'prod_prem_diya_d6',
    productCode: 'PRM-D06',
    name: 'Sacred Kurma Avatar Tortoise Brass Diya (Design 6)',
    slug: 'sacred-kurma-avatar-tortoise-brass-diya-design-6',
    shortDescription: 'Vastu-energized brass deepam resting on a finely carved tortoise (Kurma) base for stability.',
    description: 'Design 6 of our Signature Premium Series. The sacred tortoise base anchors positive spiritual energy and prosperity according to Vastu Shastra while holding a sparkling oil flame.',
    price: 1199,
    salePrice: 899,
    categoryId: 'brass',
    images: [{ url: '/uploads/premium_brass_diya.jpg', alt: 'Sacred Kurma Tortoise Brass Diya', isMain: true, sortOrder: 0 }],
    specifications: { 'Design Variant': '6: Kurma Tortoise Base', 'Significance': 'Vastu & Prosperity', 'Material': 'Brass' },
    stockQuantity: 60,
    status: 'published',
    featured: true,
    createdAt: now,
    updatedAt: now
  },

  // Design 7
  {
    id: 'prod_prem_diya_d7',
    productCode: 'PRM-D07',
    name: 'Ornate Shankh & Chakra Divine Brass Diya (Design 7)',
    slug: 'ornate-shankh-chakra-divine-brass-diya-design-7',
    shortDescription: 'Vaishnavite ceremonial lamp flanked by the sacred conch shell (Shankh) and Sudarshana Chakra.',
    description: 'Design 7 of our Signature Premium Series. Carved with divine emblems of Lord Vishnu, this exquisite deepam brings cosmic peace and spiritual protection to your household altar.',
    price: 1399,
    salePrice: 1049,
    categoryId: 'brass',
    images: [{ url: '/uploads/premium_brass_diya.jpg', alt: 'Ornate Shankh Chakra Brass Diya', isMain: true, sortOrder: 0 }],
    specifications: { 'Design Variant': '7: Shankh Chakra Motifs', 'Material': 'Antiqued Brass', 'Weight': '520g' },
    stockQuantity: 40,
    status: 'published',
    featured: true,
    createdAt: now,
    updatedAt: now
  },

  // Design 8
  {
    id: 'prod_prem_diya_d8',
    productCode: 'PRM-D08',
    name: 'Filigree Jali Cutwork Moroccan-Style Brass Lantern Diya (Design 8)',
    slug: 'filigree-jali-cutwork-lantern-brass-diya-design-8',
    shortDescription: 'Intricate pierced lattice-work lantern diya casting dramatic floral kaleidoscope shadows.',
    description: 'Design 8 of our Signature Premium Series. Hand-pierced metal lattice walls scatter glowing shadow patterns across walls and tables, blending palace architecture with festival cheer.',
    price: 1699,
    salePrice: 1349,
    categoryId: 'designer',
    images: [{ url: '/uploads/designer_diya_set.jpg', alt: 'Filigree Cutwork Lantern Brass Diya', isMain: true, sortOrder: 0 }],
    specifications: { 'Design Variant': '8: Filigree Jali Cutwork', 'Finish': 'Matte Gold', 'Lighting': 'Oil or Tealight' },
    stockQuantity: 30,
    status: 'published',
    featured: true,
    createdAt: now,
    updatedAt: now
  },

  // 7) Swastik Diya
  {
    id: 'prod_swastik_diya_01',
    productCode: 'SWS-001',
    name: 'Auspicious Swastika Shubh Deepam in Pure Brass',
    slug: 'auspicious-swastika-shubh-deepam-pure-brass',
    shortDescription: 'Sacred Swastik engraved brass diya invoking peace, good fortune, and warding off negative energy.',
    description: 'The ancient symbol of auspiciousness and cosmic harmony. This sacred Swastika Shubh Deepam is carved with four sacred wick corners and Shubh-Labh blessings. A must-have for Griha Pravesh, Diwali Lakshmi Puja, and new beginnings.',
    price: 799,
    salePrice: 599,
    categoryId: 'brass',
    images: [{ url: '/uploads/premium_brass_diya.jpg', alt: 'Auspicious Swastika Shubh Deepam', isMain: true, sortOrder: 0 }],
    specifications: { 'Symbolism': 'Shubh & Labh Swastik', 'Material': 'Solid Brass', 'Wicks': '4 Directional Wells' },
    stockQuantity: 90,
    status: 'published',
    featured: true,
    createdAt: now,
    updatedAt: now
  }
];

// Append products (avoid duplicate productCodes)
const existingCodes = new Set(products.map(p => p.productCode));
let addedCount = 0;

for (const p of newProducts) {
  if (!existingCodes.has(p.productCode)) {
    products.push(p);
    existingCodes.add(p.productCode);
    addedCount++;
  } else {
    // Update if already exists
    const idx = products.findIndex(x => x.productCode === p.productCode);
    if (idx !== -1) {
      products[idx] = p;
    }
  }
}

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
console.log(`Successfully added/updated ${newProducts.length} stylish products! Total in catalog: ${products.length}`);
