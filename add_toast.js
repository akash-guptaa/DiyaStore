const fs = require('fs');

let providerCode = fs.readFileSync('src/components/CartProvider.tsx', 'utf8');

if (!providerCode.includes('isCartBumping')) {
  providerCode = providerCode.replace(
    'cartTotal: number;\n}',
    'cartTotal: number;\n  isCartBumping: boolean;\n  toastMessage: string | null;\n}'
  );

  providerCode = providerCode.replace(
    'const [loaded, setLoaded] = useState(false);',
    'const [loaded, setLoaded] = useState(false);\n  const [isCartBumping, setIsCartBumping] = useState(false);\n  const [toastMessage, setToastMessage] = useState<string | null>(null);'
  );

  providerCode = providerCode.replace(
    "alert('Added to cart!');",
    "setIsCartBumping(true);\n    setToastMessage(`Added to cart!`);\n    setTimeout(() => setIsCartBumping(false), 300);\n    setTimeout(() => setToastMessage(null), 3000);"
  );

  providerCode = providerCode.replace(
    'value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}',
    'value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, isCartBumping, toastMessage }}'
  );

  providerCode = providerCode.replace(
    '{children}\n    </CartContext.Provider>',
    `{children}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-stone-900 text-white px-6 py-3 rounded-full shadow-2xl font-medium text-sm flex items-center gap-2 border-2 border-stone-700">
            <span className="text-green-400">✓</span> {toastMessage}
          </div>
        </div>
      )}
    </CartContext.Provider>`
  );

  fs.writeFileSync('src/components/CartProvider.tsx', providerCode);
}

let headerCode = fs.readFileSync('src/components/Header.tsx', 'utf8');

if (!headerCode.includes('isCartBumping')) {
  headerCode = headerCode.replace(
    'const { items } = useCart();',
    'const { items, isCartBumping } = useCart();'
  );

  headerCode = headerCode.replace(
    'className="relative text-stone-800 flex items-center font-bold bg-stone-100 px-4 py-2 rounded-full hover:bg-stone-200 transition-colors"',
    'className={`relative flex items-center font-bold px-4 py-2 rounded-full transition-all duration-300 ${isCartBumping ? "bg-green-500 text-white scale-110 shadow-lg" : "bg-stone-100 text-stone-800 hover:bg-stone-200"}`}'
  );
  
  fs.writeFileSync('src/components/Header.tsx', headerCode);
}
