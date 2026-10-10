import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-200 pt-16 pb-8 border-t-4 border-rose-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <h3 className="font-merriweather text-2xl font-bold text-white mb-4">Diya Store</h3>
          <p className="text-stone-400 mb-6 max-w-sm">
            Discover beautiful diyas that bring warmth, tradition, and elegance to every celebration. Premium Indian handicraft and home décor.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="text-stone-400 hover:text-white transition-colors">Shop All Products</Link></li>
            <li><Link href="/profile" className="text-stone-400 hover:text-white transition-colors">My Profile & Orders</Link></li>
            <li><Link href="/cart" className="text-stone-400 hover:text-white transition-colors">Shopping Cart</Link></li>
            <li><Link href="/admin" className="text-stone-400 hover:text-white transition-colors">Admin Dashboard</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Contact & Store</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="text-rose-500">📍</span>
              <span className="text-stone-400 text-sm">
                Shop No. 1, Girnar Dharshan, Narayan Nagar Road, Bhayandar West, Maharashtra – 401101, India. (5-min walk from station)
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-rose-500">📞</span>
              <span className="text-stone-400 text-sm">+91 7400422743 / +91 9322274986</span>
            </li>
            <li className="mt-4">
              <a 
                href="https://maps.app.goo.gl/RKAF5cEqpZuYQtny9?g_st=aw" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-stone-800 text-white px-4 py-2 rounded hover:bg-rose-900 transition-colors text-sm font-semibold border border-stone-700"
              >
                🗺️ Open in Google Maps
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-stone-800 pt-8 text-center text-sm text-stone-500">
        &copy; {new Date().getFullYear()} Diya Store. All rights reserved.
      </div>
    </footer>
  );
}