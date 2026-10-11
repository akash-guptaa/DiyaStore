const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Admin\\Downloads\\WhatsApp Unknown 2026-10-11 at 10.33.47 PM';
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function safeCopy(srcName, destName) {
  const s = path.join(srcDir, srcName);
  const d = path.join(uploadsDir, destName);
  if (fs.existsSync(s)) {
    fs.copyFileSync(s, d);
    return `/uploads/${destName}`;
  } else {
    console.warn(`File not found: ${srcName}`);
    return null;
  }
}

const now = new Date().toISOString();

const newArrivals = [
  // 1. Shubh Labh Hanging Diya Pair
  {
    id: 'prod_na_shubh_01',
    productCode: 'NA-SHUBH-01',
    name: 'Auspicious Shubh Labh Handcrafted Door Hanging Diya (Pair)',
    slug: 'auspicious-shubh-labh-door-hanging-diya-pair',
    shortDescription: 'Sacred Shubh-Labh clay hanging diyas with relief calligraphy and wall mounting loops.',
    description: 'Welcome Goddess Lakshmi and Lord Ganesha to your home with this sacred pair of Shubh-Labh hanging diyas. Handcrafted by master artisans from pure riverbed terracotta clay, each piece features high-relief Devanagari lettering, radiant sun-flame motifs, and durable metal hanging hooks. Can be hung at main doorways or placed flat on puja altars.',
    price: 399,
    salePrice: 299,
    categoryId: 'terracotta',
    images: [
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.55 PM.jpeg', 'shubh_labh_diya_1.jpg'), alt: 'Shubh Labh Hanging Diya Front View', isMain: true, sortOrder: 0 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.57 PM.jpeg', 'shubh_labh_diya_2.jpg'), alt: 'Shubh Labh Diya In-Hand View', isMain: false, sortOrder: 1 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.59 PM (1).jpeg', 'shubh_labh_diya_3.jpg'), alt: 'Shubh Labh Diya Table Display', isMain: false, sortOrder: 2 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.58 PM.jpeg', 'shubh_labh_diya_4.jpg'), alt: 'Shubh Labh Diya Top Angle', isMain: false, sortOrder: 3 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.54 PM.jpeg', 'shubh_labh_diya_5.jpg'), alt: 'Shubh Labh Diya Side Profile', isMain: false, sortOrder: 4 }
    ].filter(img => img.url),
    specifications: { 'Quantity': 'Set of 2 (Shubh & Labh)', 'Material': 'Terracotta Clay', 'Mounting': 'Wall Loop & Table Stand' },
    stockQuantity: 40,
    status: 'published',
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },

  // 2. Peacock 5-Wick Rangoli Diya
  {
    id: 'prod_na_peacock_02',
    productCode: 'NA-PEACOCK-02',
    name: 'Majestic Handcrafted Mayur 5-Wick Terracotta Rangoli Diya',
    slug: 'majestic-handcrafted-mayur-5wick-terracotta-rangoli-diya',
    shortDescription: 'Magnificent peacock centerpiece diya with 5 flame wells and sparkling shisha mirrors.',
    description: 'An iconic Diwali showstopper. This sculptural terracotta diya represents Mayur (the royal peacock) with an upright hand-painted tail fan detailed in sapphire blue, emerald green, and gold glitter. Five generous oil wick chalices surround the front pedestal, casting a breathtaking semi-circle of light across your rangoli.',
    price: 599,
    salePrice: 449,
    categoryId: 'terracotta',
    images: [
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.33.24 PM.jpeg', 'peacock_5wick_diya_1.jpg'), alt: 'Majestic Peacock 5-Wick Diya', isMain: true, sortOrder: 0 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.33.20 PM.jpeg', 'peacock_5wick_diya_2.jpg'), alt: 'Peacock Diya Side Profile', isMain: false, sortOrder: 1 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.33.22 PM.jpeg', 'peacock_5wick_diya_3.jpg'), alt: 'Peacock Diya Front Angle', isMain: false, sortOrder: 2 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.33.21 PM.jpeg', 'peacock_5wick_diya_4.jpg'), alt: 'Peacock Diya Tail Detail', isMain: false, sortOrder: 3 }
    ].filter(img => img.url),
    specifications: { 'Flame Capacity': '5 Cotton Wicks', 'Material': 'Terracotta Clay & Glass Mirrors', 'Craft': 'Hand-Sculpted & Painted' },
    stockQuantity: 30,
    status: 'published',
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },

  // 3. Blooming Lotus Clay Diya
  {
    id: 'prod_na_lotus_03',
    productCode: 'NA-LOTUS-03',
    name: 'Handmade Blooming Kamal Lotus Multi-Layered Terracotta Diya',
    slug: 'handmade-blooming-kamal-lotus-multilayered-terracotta-diya',
    shortDescription: 'Sacred pink lotus diya with sculpted multi-tier petals and gold glitter highlights.',
    description: 'Inspired by the celestial seat of Goddess Lakshmi, this blooming lotus diya features intricately formed layered clay petals in radiant shades of rose pink, accented with golden outlines and a sparkling center gem. Perfect for floating flower bowls, mandir altars, and festive dining centerpieces.',
    price: 349,
    salePrice: 249,
    categoryId: 'terracotta',
    images: [
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.32.04 PM.jpeg', 'blooming_lotus_diya_1.jpg'), alt: 'Blooming Lotus Diya Top View', isMain: true, sortOrder: 0 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.32.01 PM.jpeg', 'blooming_lotus_diya_2.jpg'), alt: 'Blooming Lotus Diya Hand Perspective', isMain: false, sortOrder: 1 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.32.05 PM.jpeg', 'blooming_lotus_diya_3.jpg'), alt: 'Blooming Lotus Diya Angle View', isMain: false, sortOrder: 2 }
    ].filter(img => img.url),
    specifications: { 'Motif': 'Kamal / Lotus Flower', 'Material': 'Clay & Non-toxic Acrylic', 'Diameter': 'Approx 4.5 inches' },
    stockQuantity: 50,
    status: 'published',
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },

  // 4. Kundan Aarti Thali Set
  {
    id: 'prod_na_thali_04',
    productCode: 'NA-THALI-04',
    name: 'Royal Crystal Kundan Embellished Puja Aarti Thali (Set of 5 Diyas)',
    slug: 'royal-crystal-kundan-puja-aarti-thali-set-5-diyas',
    shortDescription: 'Festive hot-pink brocade finished thali studded with crystals and 5 matching diyas.',
    description: 'Elevate your Diwali Lakshmi Puja with this luxurious handcrafted Aarti Thali. Wrapped in shimmering metallic fuchsia fabric with gold braided borders, it comes complete with five diamond-rhinestone encrusted earthen diyas. Shrink-wrapped for pristine gifting.',
    price: 699,
    salePrice: 499,
    categoryId: 'designer',
    images: [
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.33.13 PM.jpeg', 'kundan_thali_set_1.jpg'), alt: 'Kundan Aarti Thali Top View', isMain: true, sortOrder: 0 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.33.11 PM.jpeg', 'kundan_thali_set_2.jpg'), alt: 'Kundan Aarti Thali Angled View', isMain: false, sortOrder: 1 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.33.14 PM.jpeg', 'kundan_thali_set_3.jpg'), alt: 'Kundan Aarti Thali Packaging Shot', isMain: false, sortOrder: 2 }
    ].filter(img => img.url),
    specifications: { 'Set Includes': '1 Designer Thali + 5 Jeweled Diyas', 'Diameter': '7.5 inches', 'Finish': 'Brocade & Rhinestones' },
    stockQuantity: 25,
    status: 'published',
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },

  // 5. Maa Lakshmi Charan Paduka Pedestal Diya
  {
    id: 'prod_na_charan_05',
    productCode: 'NA-CHARAN-05',
    name: 'Maa Lakshmi Sacred Charan Paduka with Swastik Pedestal Diya (Pair)',
    slug: 'maa-lakshmi-charan-paduka-swastik-pedestal-diya-pair',
    shortDescription: 'Auspicious Lakshmi Charan feet with sacred Swastik symbols and elevated chalice diyas.',
    description: 'Bring boundless good fortune and Lakshmiji blessings to your home. This sacred clay pair is hand-modeled in the divine likeness of Goddess Lakshmi’s auspicious feet, adorned with green glitter toe rings, sacred Swastik glyphs, and elevated flame pedestals. Placed by thresholds, rangolis, and lockers.',
    price: 399,
    salePrice: 299,
    categoryId: 'terracotta',
    images: [
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.52 PM.jpeg', 'laxmi_charan_diya_1.jpg'), alt: 'Lakshmi Charan Elevated Diya Front', isMain: true, sortOrder: 0 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.53 PM.jpeg', 'laxmi_charan_diya_2.jpg'), alt: 'Lakshmi Charan Diya Side Elevation', isMain: false, sortOrder: 1 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.49 PM.jpeg', 'laxmi_charan_diya_3.jpg'), alt: 'Flat Lakshmi Charan Paduka Pair', isMain: false, sortOrder: 2 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.51 PM.jpeg', 'laxmi_charan_diya_4.jpg'), alt: 'Lakshmi Charan Hand Shot', isMain: false, sortOrder: 3 }
    ].filter(img => img.url),
    specifications: { 'Design': 'Lakshmi Charan Paduka + Swastik', 'Quantity': '1 Pair (Left & Right)', 'Material': 'Clay' },
    stockQuantity: 45,
    status: 'published',
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },

  // 6. Glitter Matka Mombatti Set of 6
  {
    id: 'prod_na_candle_06',
    productCode: 'NA-CANDLE-06',
    name: 'Shimmering Golden Glitter Matka Mombatti Candle Set (Pack of 6)',
    slug: 'shimmering-golden-glitter-matka-mombatti-candle-pack-6',
    shortDescription: 'Ready-to-burn wax-filled earthen pot candles with sparkling gold finish in triangle pack.',
    description: 'Enjoy hassle-free festive lighting with our sparkling Matka Mombatti set. Six hand-painted red terracotta pots with white floral lace trim, filled with high-grade golden shimmer wax and smokeless cotton wicks. Burns steadily for over 6 hours without oil spillages.',
    price: 449,
    salePrice: 349,
    categoryId: 'designer',
    images: [
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.33.16 PM.jpeg', 'glitter_matka_candle_1.jpg'), alt: 'Golden Glitter Matka Candle Pack', isMain: true, sortOrder: 0 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.33.17 PM.jpeg', 'glitter_matka_candle_2.jpg'), alt: 'Glitter Matka Candles Hand View', isMain: false, sortOrder: 1 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.33.18 PM.jpeg', 'glitter_matka_candle_3.jpg'), alt: 'Traditional Matka Candles with Lace', isMain: false, sortOrder: 2 }
    ].filter(img => img.url),
    specifications: { 'Wax Type': 'Clean Burning Golden Shimmer Wax', 'Quantity': 'Pack of 6', 'Burn Time': '6+ Hours' },
    stockQuantity: 60,
    status: 'published',
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },

  // 7. Sunflower Diya Gift Box Set of 6
  {
    id: 'prod_na_box_07',
    productCode: 'NA-BOX-07',
    name: 'Heritage Vibrant Sunflower Hand-Painted Diya Gift Box (Set of 6)',
    slug: 'heritage-sunflower-handpainted-diya-gift-box-6',
    shortDescription: 'Luxury boxed set of 6 sunflower rangoli clay diyas with central shisha mirrors.',
    description: 'An auspicious gift for Diwali. Encased in a sturdy compartment gift box, these six handcrafted terracotta diyas feature vibrant sunflower petal carvings painted in joyous yellow, pink, and emerald, centered around reflective glass mirrors for double illumination.',
    price: 499,
    salePrice: 399,
    categoryId: 'terracotta',
    images: [
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.41 PM.jpeg', 'sunflower_diya_box_1.jpg'), alt: 'Sunflower Diya Gift Box Front', isMain: true, sortOrder: 0 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.48 PM.jpeg', 'sunflower_diya_box_2.jpg'), alt: 'Sunflower Diya Gift Box Display', isMain: false, sortOrder: 1 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.42 PM.jpeg', 'sunflower_diya_box_3.jpg'), alt: 'Sunflower Diya Box Angled Angle', isMain: false, sortOrder: 2 }
    ].filter(img => img.url),
    specifications: { 'Quantity': 'Set of 6 Diyas in Window Gift Box', 'Material': 'Terracotta with Glass Mirror' },
    stockQuantity: 35,
    status: 'published',
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },

  // 8. Crimson Square Kundan Diya Box of 4
  {
    id: 'prod_na_box_08',
    productCode: 'NA-BOX-08',
    name: 'Royal Crimson Square Kundan Terracotta Diya Luxury Box (Set of 4)',
    slug: 'royal-crimson-square-kundan-terracotta-diya-box-4',
    shortDescription: 'Set of 4 square-profile deep reservoir clay diyas with kundan stones in a gold gift box.',
    description: 'Combining Mughal geometric artistry with Indian pottery traditions. These 4 square deep-dish diyas are finished in festive vermilion with white wave relief, green emerald accents, and sparkling rhinestones, presented in a satin-yellow partitioned box.',
    price: 449,
    salePrice: 349,
    categoryId: 'designer',
    images: [
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.44 PM.jpeg', 'crimson_square_box_1.jpg'), alt: 'Square Kundan Diya Gift Box', isMain: true, sortOrder: 0 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.45 PM.jpeg', 'crimson_square_box_2.jpg'), alt: 'Square Diya Box Side Profile', isMain: false, sortOrder: 1 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.47 PM.jpeg', 'crimson_square_box_3.jpg'), alt: 'Square Diya Set Presentation Shot', isMain: false, sortOrder: 2 }
    ].filter(img => img.url),
    specifications: { 'Shape': 'Square Geometric Deep Dish', 'Quantity': '4 Diyas in Box', 'Material': 'Clay' },
    stockQuantity: 35,
    status: 'published',
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },

  // 9. Emerald Kundan Mirror Diya Pack of 4
  {
    id: 'prod_na_pack_09',
    productCode: 'NA-PACK-09',
    name: 'Hand-Painted Emerald Kundan Mirror Clay Diya Pack (Set of 4)',
    slug: 'emerald-kundan-mirror-clay-diya-pack-4',
    shortDescription: 'Pack of 4 round clay diyas with emerald green fluting and round mirror centers.',
    description: 'A classic favorite for festive rangoli borders. Features 4 perfectly rounded earthen diyas featuring sunburst green enamel strokes, white beaded relief rim, and polished glass mirrors that catch and amplify candlelight.',
    price: 299,
    salePrice: 219,
    categoryId: 'terracotta',
    images: [
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.30.52 PM.jpeg', 'emerald_mirror_diya_1.jpg'), alt: 'Emerald Mirror Diya Pack Front', isMain: true, sortOrder: 0 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.30.53 PM (1).jpeg', 'emerald_mirror_diya_2.jpg'), alt: 'Emerald Mirror Diya Hand Shot', isMain: false, sortOrder: 1 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.30.53 PM.jpeg', 'emerald_mirror_diya_3.jpg'), alt: 'Emerald Mirror Diya Angle', isMain: false, sortOrder: 2 }
    ].filter(img => img.url),
    specifications: { 'Quantity': 'Pack of 4', 'Material': 'Natural Terracotta Clay', 'Color': 'Emerald & Gold' },
    stockQuantity: 80,
    status: 'published',
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },

  // 10. Ruby Blossom Terracotta Diya Pack of 4
  {
    id: 'prod_na_pack_10',
    productCode: 'NA-PACK-10',
    name: 'Festive Ruby Floral Hand-Painted Terracotta Diya Pack (Set of 4)',
    slug: 'festive-ruby-floral-terracotta-diya-pack-4',
    shortDescription: 'Rich ruby red clay diyas with floral center engravings and teardrop wick spout.',
    description: 'Painted in auspicious kumkum ruby red with yellow and white border tracery. The molded flower interior cradles a shimmering green gem that sparkles delightfully when the diya is filled with oil.',
    price: 299,
    salePrice: 219,
    categoryId: 'terracotta',
    images: [
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.30.55 PM.jpeg', 'ruby_blossom_diya_1.jpg'), alt: 'Ruby Floral Diya Pack Front', isMain: true, sortOrder: 0 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.30.56 PM.jpeg', 'ruby_blossom_diya_2.jpg'), alt: 'Ruby Floral Diya Hand Perspective', isMain: false, sortOrder: 1 }
    ].filter(img => img.url),
    specifications: { 'Quantity': 'Pack of 4', 'Material': 'Terracotta Clay', 'Color': 'Ruby Red & Yellow' },
    stockQuantity: 70,
    status: 'published',
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },

  // 11. Glistening Magenta Kundan Star Diya Pack of 4
  {
    id: 'prod_na_pack_11',
    productCode: 'NA-PACK-11',
    name: 'Glistening Magenta Kundan Floral Diya Pack (Set of 4)',
    slug: 'glistening-magenta-kundan-floral-diya-pack-4',
    shortDescription: 'Four hand-painted pink/magenta clay diyas with floral starlight petals and glass mirrors.',
    description: 'Brighten up every corner with these radiant magenta diyas. Featuring 8-pointed golden sunburst petals and delicate yellow scalloped rims, each diya holds ample oil for hours of festive celebration.',
    price: 299,
    salePrice: 219,
    categoryId: 'terracotta',
    images: [
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.01 PM.jpeg', 'magenta_kundan_diya_1.jpg'), alt: 'Magenta Kundan Diya Pack Front', isMain: true, sortOrder: 0 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.02 PM.jpeg', 'magenta_kundan_diya_2.jpg'), alt: 'Magenta Kundan Diya Pack In-Hand', isMain: false, sortOrder: 1 }
    ].filter(img => img.url),
    specifications: { 'Quantity': 'Pack of 4', 'Material': 'Earthen Clay', 'Color': 'Magenta & Sunshine Yellow' },
    stockQuantity: 65,
    status: 'published',
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },

  // 12. Golden Marigold Clay Diya Pack of 4
  {
    id: 'prod_na_pack_12',
    productCode: 'NA-PACK-12',
    name: 'Traditional Golden Marigold Handcrafted Clay Diya Pack (Set of 4)',
    slug: 'traditional-golden-marigold-clay-diya-pack-4',
    shortDescription: 'Earthy terracotta diyas with deep maroon base and marigold yellow petal rim.',
    description: 'An ode to traditional festive marigold garlands. Hand-molded with pointed flame spouts and decorated with authentic yellow-white accents and center mirrors for a truly traditional aesthetic.',
    price: 299,
    salePrice: 219,
    categoryId: 'terracotta',
    images: [
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.30.54 PM.jpeg', 'marigold_diya_pack_1.jpg'), alt: 'Golden Marigold Diya Pack Front', isMain: true, sortOrder: 0 }
    ].filter(img => img.url),
    specifications: { 'Quantity': 'Pack of 4', 'Material': 'Natural Terracotta', 'Design': 'Marigold Petals' },
    stockQuantity: 75,
    status: 'published',
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },

  // 13. Yellow Emerald Floral Diya Luxury Gift Box
  {
    id: 'prod_na_box_13',
    productCode: 'NA-BOX-13',
    name: 'Yellow Emerald Floral Terracotta Diya Luxury Gift Box (Set of 4)',
    slug: 'yellow-emerald-floral-terracotta-diya-box-4',
    shortDescription: 'Artistic teardrop clay diyas with yellow sunray and studded green emerald rhinestones.',
    description: 'Designed as a premium gifting presentation, this yellow partition box holds four large curved petal diyas with two-tone yellow-pink backgrounds, beaded green glass jewels, and high-gloss glaze.',
    price: 449,
    salePrice: 349,
    categoryId: 'designer',
    images: [
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.38 PM.jpeg', 'yellow_emerald_box_1.jpg'), alt: 'Yellow Emerald Boxed Diya Set', isMain: true, sortOrder: 0 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.38 PM (1).jpeg', 'yellow_emerald_box_2.jpg'), alt: 'Yellow Emerald Diya Box Angle', isMain: false, sortOrder: 1 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.39 PM.jpeg', 'yellow_emerald_box_3.jpg'), alt: 'Yellow Emerald Diya In-Hand View', isMain: false, sortOrder: 2 },
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.43 PM (1).jpeg', 'yellow_emerald_box_4.jpg'), alt: 'Yellow Emerald Diya Display Box', isMain: false, sortOrder: 3 }
    ].filter(img => img.url),
    specifications: { 'Quantity': 'Set of 4 in Gift Box', 'Material': 'Terracotta Clay & Glass Rhinestones' },
    stockQuantity: 40,
    status: 'published',
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  },

  // 14. Pure Mitti Pedestal Matka Diya
  {
    id: 'prod_na_mitti_14',
    productCode: 'NA-MITTI-14',
    name: 'Eco-Friendly Traditional Mitti Pedestal Matka Diya (Set of 2)',
    slug: 'ecofriendly-traditional-mitti-pedestal-matka-diya-set-2',
    shortDescription: 'Authentic 100% natural clay pedestal diyas for sacred daily puja rituals.',
    description: 'Hand-shaped from organic river clay on traditional potter wheels. Elevated pedestal stands keep table surfaces cool while the broad mouth holds mustard or sesame oil for long sacred burns.',
    price: 199,
    salePrice: 149,
    categoryId: 'terracotta',
    images: [
      { url: safeCopy('WhatsApp Image 2026-10-11 at 10.31.50 PM.jpeg', 'mitti_pedestal_diya_1.jpg'), alt: 'Mitti Pedestal Matka Diya Pair', isMain: true, sortOrder: 0 }
    ].filter(img => img.url),
    specifications: { 'Quantity': 'Set of 2', 'Material': '100% Biodegradable Earthen Mitti' },
    stockQuantity: 100,
    status: 'published',
    featured: true,
    isNewArrival: true,
    createdAt: now,
    updatedAt: now
  }
];

// Load existing products and prepend or merge new arrivals
const productsFile = path.join(process.cwd(), 'data', 'products.json');
let products = [];
try {
  products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
} catch (e) {
  products = [];
}

const existingCodes = new Set(products.map(p => p.productCode));

// Put new arrivals first so they appear prominently at the top
const toAdd = [];
for (const item of newArrivals) {
  if (existingCodes.has(item.productCode)) {
    const idx = products.findIndex(p => p.productCode === item.productCode);
    products[idx] = item;
  } else {
    toAdd.push(item);
  }
}

const updatedProducts = [...toAdd, ...products];

fs.writeFileSync(productsFile, JSON.stringify(updatedProducts, null, 2));

console.log(`Successfully added ${toAdd.length} New Arrival products with actual real photos!`);
console.log(`Total catalog items: ${updatedProducts.length}`);
