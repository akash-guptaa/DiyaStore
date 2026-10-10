const fs = require('fs');
const path = require('path');

const files = {
  "src/app/page.tsx": `
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/store';

export default async function Home() {
  const products = await getProducts();
  const publishedProducts = products.filter(p => p.status === 'published');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 md:px-8 border-b border-stone-200 bg-white">
        <div className="font-merriweather font-bold text-2xl text-rose-900">Diya Store</div>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="hover:text-rose-900">Home</Link>
          <Link href="/shop" className="hover:text-rose-900">Shop All</Link>
          <Link href="/contact" className="hover:text-rose-900">Contact</Link>
        </nav>
        <Link href="https://wa.me/917400422743" target="_blank" className="text-green-600 font-semibold">
          WhatsApp Us
        </Link>
      </header>

      <section className="bg-orange-50 py-20 px-4 text-center">
        <h1 className="font-merriweather text-4xl md:text-5xl font-bold mb-4 text-stone-900">Light Up Every Moment.</h1>
        <p className="text-lg md:text-xl text-stone-600 mb-8 max-w-2xl mx-auto">
          Discover beautiful diyas that bring warmth, tradition, and elegance to every celebration.
        </p>
        <Link href="#products" className="bg-rose-900 text-white px-8 py-3 rounded hover:bg-rose-800 transition-colors">
          Shop Now
        </Link>
      </section>

      <main id="products" className="flex-1 max-w-7xl mx-auto p-4 md:p-8 w-full">
        <h2 className="font-merriweather text-3xl font-bold mb-8 text-center mt-8">Our Collection</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {publishedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <Link href={\`/product/\${product.slug || product.id}\`}>
                <div className="relative aspect-square bg-stone-100">
                  {product.images?.[0] ? (
                    <img src={product.images[0].url} alt={product.images[0].alt} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">No Image</div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs text-stone-500 mb-1">{product.productCode}</div>
                  <h3 className="font-semibold text-stone-900 mb-2 truncate">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">₹{product.salePrice || product.price}</span>
                    {product.salePrice && <span className="text-sm line-through text-stone-400">₹{product.price}</span>}
                  </div>
                </div>
              </Link>
              <div className="px-4 pb-4">
                <Link href={\`/checkout/\${product.id}\`} className="block w-full text-center bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors text-sm font-semibold">
                  Order on WhatsApp
                </Link>
              </div>
            </div>
          ))}
          {publishedProducts.length === 0 && (
            <div className="col-span-full text-center py-12 text-stone-500">
              No products found. Add some in the admin dashboard.
            </div>
          )}
        </div>
      </main>

      <footer className="bg-stone-900 text-stone-300 py-12 px-4 md:px-8 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white text-xl font-merriweather mb-4">Diya Store</h4>
            <p className="text-sm mb-4">Premium Indian handicraft, home décor, and festive gifting.</p>
          </div>
          <div>
            <h4 className="text-white text-lg mb-4">Contact</h4>
            <p className="text-sm">Shop No. 1, Girnar Dharshan, Narayan Nagar Road, Bhayandar West, Maharashtra – 401101, India.</p>
            <p className="text-sm mt-2">Tel: +91 7400422743 / +91 9322274986</p>
          </div>
          <div>
            <h4 className="text-white text-lg mb-4">Quick Links</h4>
            <ul className="text-sm space-y-2">
              <li><Link href="/shop" className="hover:text-white">Shop All Products</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="/admin" className="hover:text-white">Admin Dashboard</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
  `,
  "src/app/product/[id]/page.tsx": `
import Link from 'next/link';
import { getProducts } from '@/lib/store';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const products = await getProducts();
  const product = products.find(p => p.id === params.id || p.slug === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-stone-100 rounded-lg overflow-hidden">
              {product.images?.[0] ? (
                <img src={product.images[0].url} alt={product.images[0].alt} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">No Image</div>
              )}
            </div>
          </div>
          <div>
            <div className="text-sm text-stone-500 mb-2">Code: {product.productCode}</div>
            <h1 className="text-3xl font-merriweather font-bold mb-4">{product.name}</h1>
            <div className="text-2xl font-bold text-rose-900 mb-6">
              ₹{product.salePrice || product.price}
              {product.salePrice && <span className="ml-3 text-lg line-through text-stone-400">₹{product.price}</span>}
            </div>
            
            <p className="text-stone-600 mb-8 whitespace-pre-wrap">{product.description || product.shortDescription}</p>

            <Link href={\`/checkout/\${product.id}\`} className="block w-full bg-green-600 text-white text-center py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors">
              Order on WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
  `,
  "src/app/checkout/[id]/page.tsx": `
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(null);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(\`/api/products/\${id}\`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) return alert('Please fill all fields');
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: name,
          customerMobile: mobile,
          quantity
        })
      });
      
      const order = await res.json();
      
      // Construct WhatsApp URL
      const text = \`Hello! I would like to order from your Diya Store.

Order ID: \${order.id}

Customer Name: \${order.customerName}
Customer Mobile: \${order.customerMobile}

Product Name: \${order.productName}
Product Code: \${order.productCode}
Product ID: \${order.productId}
Quantity: \${order.quantity}
Unit Price: ₹\${order.unitPrice}
Total: ₹\${order.total}

Please confirm availability and delivery details.\`;

      const encodedText = encodeURIComponent(text);
      window.location.href = \`https://wa.me/917400422743?text=\${encodedText}\`;
      
    } catch (err) {
      alert('Failed to place order');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-8 text-center">Product not found</div>;

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-merriweather font-bold mb-6 text-center">Complete Your Order</h1>
        
        <div className="bg-stone-50 p-4 rounded mb-6 flex gap-4">
          {product.images?.[0] && <img src={product.images[0].url} className="w-16 h-16 object-cover rounded" />}
          <div>
            <div className="font-semibold">{product.name}</div>
            <div className="text-sm text-stone-500">{product.productCode}</div>
            <div className="font-bold text-rose-900 mt-1">₹{product.salePrice || product.price}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input required type="text" className="w-full border rounded p-2" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile Number</label>
            <input required type="tel" className="w-full border rounded p-2" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+91" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input required type="number" min="1" className="w-full border rounded p-2" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
          </div>
          
          <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>₹{(product.salePrice || product.price) * quantity}</span>
          </div>

          <button disabled={submitting} type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700">
            {submitting ? 'Processing...' : 'Continue to WhatsApp'}
          </button>
          
          <button type="button" onClick={() => router.back()} className="w-full text-stone-500 py-2">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
  `,
  "src/app/admin/page.tsx": `
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-stone-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/products" className="bg-white p-6 rounded-lg shadow hover:shadow-md">
            <h2 className="text-xl font-semibold mb-2">Products</h2>
            <p className="text-stone-500">Manage your product catalog, add new diyas, and update prices.</p>
          </Link>
          <Link href="/admin/orders" className="bg-white p-6 rounded-lg shadow hover:shadow-md">
            <h2 className="text-xl font-semibold mb-2">Orders</h2>
            <p className="text-stone-500">View WhatsApp orders, update statuses, and manage customers.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
  `,
  "src/app/admin/products/page.tsx": `
'use client';
import { useState, useEffect } from 'react';
import { Product } from '@/types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    fetch('/api/products?includeDrafts=true')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); });
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAddProduct = async () => {
    const name = prompt("Product Name:");
    if (!name) return;
    const code = prompt("Product Code (e.g. DIYA-001):");
    const price = prompt("Price:");
    
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        productCode: code,
        slug: name.toLowerCase().replace(/ /g, '-'),
        price: Number(price),
        status: 'published'
      })
    });
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(\`/api/products/\${id}\`, { method: 'DELETE' });
    fetchProducts();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={handleAddProduct} className="bg-blue-600 text-white px-4 py-2 rounded">Add Product</button>
      </div>
      
      <table className="w-full bg-white rounded shadow text-left">
        <thead>
          <tr className="bg-stone-50 border-b">
            <th className="p-4">Code</th>
            <th className="p-4">Name</th>
            <th className="p-4">Price</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-b">
              <td className="p-4">{p.productCode}</td>
              <td className="p-4">{p.name}</td>
              <td className="p-4">₹{p.price}</td>
              <td className="p-4">{p.status}</td>
              <td className="p-4 space-x-2">
                <button onClick={() => handleDelete(p.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
  `,
  "src/app/admin/orders/page.tsx": `
'use client';
import { useState, useEffect } from 'react';
import { Order } from '@/types';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(setOrders);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <table className="w-full bg-white rounded shadow text-left">
        <thead>
          <tr className="bg-stone-50 border-b">
            <th className="p-4">ID</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Product</th>
            <th className="p-4">Total</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-b">
              <td className="p-4 text-sm text-stone-500">{o.id}</td>
              <td className="p-4">
                <div>{o.customerName}</div>
                <div className="text-sm text-stone-500">{o.customerMobile}</div>
              </td>
              <td className="p-4">
                <div>{o.productName}</div>
                <div className="text-sm text-stone-500">{o.productCode} x {o.quantity}</div>
              </td>
              <td className="p-4">₹{o.total}</td>
              <td className="p-4">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
  `
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
}
console.log('Files generated successfully.');
