const fs = require('fs');

let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

if (!header.includes("import Image from 'next/image';")) {
  header = header.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport Image from 'next/image';");
}

const oldLink = '<Link href="/" className="font-merriweather font-bold text-2xl text-rose-900">Diya Store</Link>';
const newLink = `
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 overflow-hidden rounded-full border border-stone-200 shadow-sm flex items-center justify-center bg-white">
          <Image src="/logo.jpg" alt="Diya Store Logo" width={40} height={40} className="object-cover scale-[1.3]" />
        </div>
        <span className="font-merriweather font-bold text-2xl text-rose-900">Diya Store</span>
      </Link>
`;

header = header.replace(oldLink, newLink.trim());
fs.writeFileSync('src/components/Header.tsx', header);
console.log("Header updated with logo");
