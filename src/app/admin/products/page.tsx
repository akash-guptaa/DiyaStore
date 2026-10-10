'use client';
import { useState, useEffect } from 'react';
import { Product, ProductImage } from '@/types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    productCode: '',
    shortDescription: '',
    description: '',
    price: '',
    salePrice: '',
    categoryId: '',
    stockQuantity: '10',
    images: [] as ProductImage[]
  });
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchProducts = () => {
    fetch('/api/products?includeDrafts=true')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); });
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFilesToUpload(Array.from(e.target.files));
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', productCode: '', shortDescription: '', description: '', price: '', salePrice: '', categoryId: '', stockQuantity: '10', images: [] });
    setFilesToUpload([]);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      productCode: product.productCode,
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      price: String(product.price),
      salePrice: product.salePrice ? String(product.salePrice) : '',
      categoryId: product.categoryId || '',
      stockQuantity: String(product.stockQuantity),
      images: product.images || []
    });
    setFilesToUpload([]);
    setIsModalOpen(true);
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    let uploadedImages = [...formData.images];

    // Upload new files if any
    if (filesToUpload.length > 0) {
      const uploadData = new FormData();
      filesToUpload.forEach(f => uploadData.append('files', f));
      
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
      if (uploadRes.ok) {
        const { urls } = await uploadRes.json();
        const newImgs: ProductImage[] = urls.map((url: string, i: number) => ({
          url, alt: formData.name, isMain: uploadedImages.length === 0 && i === 0, sortOrder: uploadedImages.length + i
        }));
        uploadedImages = [...uploadedImages, ...newImgs];
      }
    }
    
    const payload = {
      ...formData,
      slug: formData.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : null,
      stockQuantity: Number(formData.stockQuantity),
      images: uploadedImages,
      status: 'published'
    };

    if (editingId) {
      await fetch('/api/products/' + editingId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    
    setSaving(false);
    setIsModalOpen(false);
    fetchProducts();
  };

  
  const exportCSV = () => {
    const headers = ['Code', 'Name', 'Price', 'Sale Price', 'Stock', 'Status'];
    const rows = products.map(p => [p.productCode, p.name, p.price, p.salePrice || '', p.stockQuantity, p.status]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch('/api/products/' + id, { method: 'DELETE' });
    fetchProducts();
  };

  if (loading) return <div className="p-8">Loading products...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={exportCSV} className="bg-stone-200 text-stone-800 px-4 py-2 rounded font-medium hover:bg-stone-300 mr-4">Download CSV</button>
        <button onClick={openAddModal} className="bg-rose-700 text-white px-6 py-2 rounded font-medium hover:bg-rose-800 transition-colors shadow-sm">
          + Add Product
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow text-left min-w-max">
          <thead>
            <tr className="bg-stone-50 border-b">
              <th className="p-4 w-16">Image</th>
              <th className="p-4">Code</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b">
                <td className="p-4">
                  {p.images?.[0] ? (
                    <img src={p.images[0].url} className="w-12 h-12 object-cover rounded shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 bg-stone-200 rounded"></div>
                  )}
                </td>
                <td className="p-4 text-sm font-mono text-stone-500">{p.productCode}</td>
                <td className="p-4 font-semibold">{p.name}</td>
                <td className="p-4">
                  ₹{p.price}
                  {p.salePrice && <span className="text-xs line-through text-stone-400 block">₹{p.salePrice}</span>}
                </td>
                <td className="p-4">{p.stockQuantity}</td>
                <td className="p-4 space-x-4">
                  <button onClick={() => openEditModal(p)} className="text-blue-600 font-medium hover:underline text-sm">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 font-medium hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-stone-500">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-800 text-xl font-bold px-2">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Image Upload Section */}
              <div className="bg-stone-50 p-4 rounded border border-stone-200">
                <h3 className="font-semibold mb-2">Product Images</h3>
                
                {/* Existing Images */}
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-4 mb-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img.url} className="w-24 h-24 object-cover rounded shadow-sm border border-stone-300" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">X</button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* File Input */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-stone-600">Upload New Images</label>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
                  <p className="text-xs text-stone-400 mt-1">You can select multiple images at once.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-1">Product Name *</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-rose-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Product Code *</label>
                  <input required type="text" name="productCode" value={formData.productCode} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-rose-200" placeholder="e.g. DIYA-001" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-1">Price (₹) *</label>
                  <input required type="number" min="0" name="price" value={formData.price} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-rose-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Sale Price (₹)</label>
                  <input type="number" min="0" name="salePrice" value={formData.salePrice} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-rose-200" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Stock Qty *</label>
                  <input required type="number" min="0" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-rose-200" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-rose-200">
                  <option value="">Select a category</option>
                  <option value="terracotta">Terracotta</option>
                  <option value="brass">Brass</option>
                  <option value="designer">Designer / Hand-painted</option>
                  <option value="festive">Festive Sets</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Short Description</label>
                <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-rose-200" maxLength={150} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Full Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-rose-200 h-24"></textarea>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-stone-600 font-medium hover:bg-stone-100 rounded">
                  Cancel
                </button>
                <button disabled={saving} type="submit" className="bg-green-600 text-white px-8 py-2 rounded font-bold hover:bg-green-700 shadow shadow-green-200 transition-colors">
                  {saving ? 'Saving...' : (editingId ? 'Update Product' : 'Publish Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}