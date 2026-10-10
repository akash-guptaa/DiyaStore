const fs = require('fs');

let headerCode = fs.readFileSync('src/components/Header.tsx', 'utf8');

const oldCartHtml = `<Link href="/cart" className={\`relative flex items-center font-bold px-4 py-2 rounded-full transition-all duration-300 \${isCartBumping ? "bg-green-500 text-white scale-110 shadow-lg" : "bg-stone-100 text-stone-800 hover:bg-stone-200"}\`}>
          dY>' Cart ({itemCount})
        </Link>`;

const newCartHtml = `
        {/* Animated Cart Button */}
        <div className={\`relative rounded-full transition-all duration-300 \${isCartBumping ? 'scale-110' : ''} \${itemCount > 0 ? 'p-[2px] overflow-hidden shadow-md' : ''}\`}>
          {itemCount > 0 && !isCartBumping && (
             <div className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f43f5e_0%,#fff1f2_50%,#f43f5e_100%)] opacity-80" />
          )}
          <Link href="/cart" className={\`relative block flex items-center h-full w-full font-bold px-4 py-2 rounded-full transition-colors \${isCartBumping ? "bg-green-500 text-white shadow-lg" : itemCount > 0 ? "bg-white text-stone-800 hover:bg-stone-50" : "bg-stone-100 text-stone-800 hover:bg-stone-200"}\`}>
            🛒 Cart ({itemCount})
          </Link>
        </div>
`;

headerCode = headerCode.replace(oldCartHtml, newCartHtml.trim());
fs.writeFileSync('src/components/Header.tsx', headerCode);
console.log('Header updated with animated border');
