const fs = require('fs');

let c = fs.readFileSync('src/app/page.tsx', 'utf8');

c = c.replace(
  "import { getProducts } from '@/lib/store';",
  "import { getProducts } from '@/lib/store';\nimport { getSettings } from '@/lib/storeSettings';"
);

c = c.replace(
  "const products = await getProducts();",
  "const products = await getProducts();\n  const settings = await getSettings();"
);

c = c.replace(
  /<h1[^>]*>Light Up Every Moment.<\/h1>/,
  '<h1 className="font-merriweather text-4xl md:text-5xl font-bold mb-4 text-stone-900">{settings.heroHeadline}</h1>'
);

c = c.replace(
  /<p[^>]*>\s*Discover beautiful diyas that bring warmth, tradition, and elegance to every celebration.\s*<\/p>/,
  '<p className="text-lg md:text-xl text-stone-600 mb-8 max-w-2xl mx-auto">{settings.heroSubtitle}</p>'
);

fs.writeFileSync('src/app/page.tsx', c);
