const fs = require('fs');
let code = fs.readFileSync('src/components/BannerCarousel.tsx', 'utf8');

if (!code.includes("'/uploads/banner_home.jpg'")) {
  code = code.replace(
    "    '/uploads/banner_brass.jpg'\n  ];",
    "    '/uploads/banner_brass.jpg',\n    '/uploads/banner_home.jpg'\n  ];"
  );
  fs.writeFileSync('src/components/BannerCarousel.tsx', code);
}
