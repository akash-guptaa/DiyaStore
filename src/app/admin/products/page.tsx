'use client';
import { useState, useEffect, useRef } from 'react';
import { Product, ProductImage } from '@/types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // CSV Modal State
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvPreviewProducts, setCsvPreviewProducts] = useState<any[]>([]);
  const [csvFileName, setCsvFileName] = useState('');
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [importNotification, setImportNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const headers = ['Code', 'Name', 'Price', 'Sale Price', 'Stock', 'Status', 'Category', 'Description'];
    const rows = products.map(p => [
      `"${p.productCode || ''}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      p.price,
      p.salePrice || '',
      p.stockQuantity,
      `"${p.status || ''}"`,
      `"${p.categoryId || ''}"`,
      `"${(p.description || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSampleTemplate = () => {
    const headers = ['Code', 'Name', 'Price', 'Sale Price', 'Stock', 'Category', 'Short Description', 'Description', 'Image URL'];
    const sampleRows = [
      ['"DIYA-201"', '"Royal Mayur Brass Peacock Diya"', '1299', '999', '40', '"brass"', '"Exquisite handcrafted brass peacock diya"', '"Traditional brass deepam with five oil wells and royal feather engravings"', '"/uploads/peacock_brass_diya.jpg"'],
      ['"DIYA-202"', '"Handmade Lotus Terracotta Diya"', '349', '249', '80', '"terracotta"', '"Pink lotus petal clay diya with glitter"', '"Multi-layered blooming lotus diya hand-painted with gold highlights"', '"/uploads/blooming_lotus_diya_1.jpg"'],
      ['"DIYA-203"', '"Auspicious Shubh Labh Hanging Diya Pair"', '399', '299', '50', '"terracotta"', '"Door hanging clay diya pair with bells and loops"', '"Sacred Shubh Labh earthen diya pair for entrance and puja altar"', '"/uploads/shubh_labh_diya_1.jpg"']
    ];
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...sampleRows.map(r => r.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_products_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse CSV text
  const parseCSVText = (text: string) => {
    const lines: string[] = [];
    let current = '';
    let insideQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
        current += char;
      } else if ((char === '\n' || char === '\r') && !insideQuotes) {
        if (current.trim()) lines.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    if (current.trim()) lines.push(current.trim());

    if (lines.length < 2) {
      throw new Error("CSV file must contain at least a header row and one data row.");
    }

    const splitLine = (line: string) => {
      const cells: string[] = [];
      let cell = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
          inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
          cells.push(cell.trim());
          cell = '';
        } else {
          cell += c;
        }
      }
      cells.push(cell.trim());
      return cells.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"').trim());
    };

    const headers = splitLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const items = [];

    for (let i = 1; i < lines.length; i++) {
      const row = splitLine(lines[i]);
      if (row.length === 0 || row.every(val => val === '')) continue;

      const obj: any = {};
      headers.forEach((h, idx) => {
        const val = row[idx] || '';
        if (h.includes('code') || h === 'sku') obj.productCode = val;
        else if (h.includes('name') || h === 'title') obj.name = val;
        else if (h.includes('saleprice') || h.includes('discount')) obj.salePrice = val ? Number(val) : null;
        else if (h.includes('price') || h.includes('mrp')) obj.price = Number(val) || 0;
        else if (h.includes('stock') || h.includes('qty') || h.includes('quantity')) obj.stockQuantity = Number(val) || 10;
        else if (h.includes('category')) obj.categoryId = val || 'terracotta';
        else if (h.includes('short')) obj.shortDescription = val;
        else if (h.includes('desc')) obj.description = val;
        else if (h.includes('image') || h.includes('photo') || h.includes('url')) obj.imageUrl = val;
        else if (h.includes('status')) obj.status = val || 'published';
      });

      if (obj.name || obj.productCode) {
        if (!obj.productCode) obj.productCode = `DIYA-${Math.floor(100 + Math.random() * 900)}`;
        if (!obj.name) obj.name = 'Handcrafted Diya';
        if (!obj.price) obj.price = 299;
        items.push(obj);
      }
    }

    return items;
  };

  const handleCsvFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSVText(text);
        if (parsed.length === 0) {
          setCsvError("No valid product records found in this CSV.");
          setCsvPreviewProducts([]);
        } else {
          setCsvPreviewProducts(parsed);
        }
      } catch (err: any) {
        setCsvError(err.message || "Failed to parse CSV file.");
        setCsvPreviewProducts([]);
      }
    };
    reader.readAsText(file);
  };

  const handleImportCsv = async () => {
    if (csvPreviewProducts.length === 0) return;
    setCsvImporting(true);
    setCsvError(null);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(csvPreviewProducts)
      });

      if (!res.ok) {
        throw new Error("Server error during CSV import");
      }

      const result = await res.json();
      setImportNotification(`Successfully imported ${result.count || csvPreviewProducts.length} products from CSV!`);
      setTimeout(() => setImportNotification(null), 5000);

      setIsCsvModalOpen(false);
      setCsvPreviewProducts([]);
      setCsvFileName('');
      fetchProducts();
    } catch (err: any) {
      setCsvError(err.message || "Failed to import products.");
    } finally {
      setCsvImporting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch('/api/products/' + id, { method: 'DELETE' });
    fetchProducts();
  };

  if (loading) return <div className="p-8">Loading products...</div>;

  return (
    <div className="p-8">
      {importNotification && (
        <div className="mb-6 p-4 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg flex items-center justify-between">
          <span className="font-semibold">✓ {importNotification}</span>
          <button onClick={() => setImportNotification(null)} className="text-emerald-800 font-bold ml-4">✕</button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Products Catalog</h1>
          <p className="text-sm text-stone-500">{products.length} total products available</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => { setIsCsvModalOpen(true); setCsvPreviewProducts([]); setCsvFileName(''); setCsvError(null); }} 
            className="bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload CSV
          </button>
          
          <button onClick={exportCSV} className="bg-stone-100 text-stone-700 border border-stone-300 px-4 py-2 rounded-lg font-medium hover:bg-stone-200 transition-colors">
            Export CSV
          </button>
          
          <button onClick={openAddModal} className="bg-rose-800 text-white px-5 py-2 rounded-lg font-medium hover:bg-rose-900 transition-colors shadow-sm">
            + Add Product
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-stone-200">
        <table className="w-full text-left min-w-max border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-xs uppercase tracking-wider text-stone-600 font-bold">
              <th className="p-4 w-16">Image</th>
              <th className="p-4">Code</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Badge</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                <td className="p-4">
                  {p.images?.[0] ? (
                    <img loading="lazy" src={p.images[0].url} alt={p.name} className="w-12 h-12 object-cover rounded shadow-sm border border-stone-200" />
                  ) : (
                    <div className="w-12 h-12 bg-stone-100 rounded flex items-center justify-center text-xs text-stone-400">No img</div>
                  )}
                </td>
                <td className="p-4 text-xs font-mono font-semibold text-stone-600">{p.productCode}</td>
                <td className="p-4">
                  <div className="font-semibold text-stone-900">{p.name}</div>
                  <div className="text-xs text-stone-400 line-clamp-1 max-w-xs">{p.shortDescription}</div>
                </td>
                <td className="p-4 text-xs font-medium uppercase text-stone-500">{p.categoryId || 'terracotta'}</td>
                <td className="p-4">
                  <span className="font-bold text-rose-900">₹{p.salePrice || p.price}</span>
                  {p.salePrice && <span className="text-xs line-through text-stone-400 block">₹{p.price}</span>}
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${p.stockQuantity > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {p.stockQuantity} in stock
                  </span>
                </td>
                <td className="p-4">
                  {p.isNewArrival && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      New Arrival
                    </span>
                  )}
                </td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => openEditModal(p)} className="text-blue-600 font-semibold hover:underline text-sm">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 font-semibold hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center text-stone-500">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CSV Upload / Import Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-stone-200">
            <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-stone-50 sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-stone-900">Import Products from CSV</h2>
                <p className="text-xs text-stone-500">Upload a CSV file to bulk import products into your store catalog</p>
              </div>
              <button onClick={() => setIsCsvModalOpen(false)} className="text-stone-400 hover:text-stone-800 text-2xl font-bold px-2 leading-none">&times;</button>
            </div>

            <div className="p-6 space-y-6">
              {csvError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                  {csvError}
                </div>
              )}

              {/* Sample template banner */}
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                <div>
                  <div className="font-semibold text-sm">Need the CSV format?</div>
                  <div className="text-xs text-amber-700">Download our sample template with pre-filled examples.</div>
                </div>
                <button 
                  onClick={downloadSampleTemplate} 
                  className="bg-amber-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-amber-700 transition-colors shadow-sm"
                >
                  Download Template
                </button>
              </div>

              {/* File input dropzone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-xl p-8 text-center cursor-pointer transition-colors bg-stone-50/50 hover:bg-emerald-50/30"
              >
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept=".csv,text/csv" 
                  onChange={handleCsvFileSelect} 
                  className="hidden" 
                />
                <div className="mx-auto w-12 h-12 text-emerald-600 mb-3 flex items-center justify-center bg-emerald-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <polyline points="9 15 12 12 15 15"></polyline>
                  </svg>
                </div>
                <div className="font-semibold text-stone-800">
                  {csvFileName ? `Selected: ${csvFileName}` : 'Click here to choose a CSV file'}
                </div>
                <p className="text-xs text-stone-400 mt-1">Supports standard CSV with Code, Name, Price, Category, and Description</p>
              </div>

              {/* Preview Table */}
              {csvPreviewProducts.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-stone-800">Preview ({csvPreviewProducts.length} items found)</span>
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">Ready to import</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto border border-stone-200 rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 sticky top-0 border-b">
                        <tr>
                          <th className="p-2">Code</th>
                          <th className="p-2">Name</th>
                          <th className="p-2">Price</th>
                          <th className="p-2">Category</th>
                          <th className="p-2">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {csvPreviewProducts.slice(0, 10).map((item, idx) => (
                          <tr key={idx} className="hover:bg-stone-50">
                            <td className="p-2 font-mono text-stone-600">{item.productCode}</td>
                            <td className="p-2 font-medium text-stone-800">{item.name}</td>
                            <td className="p-2 text-rose-800 font-bold">₹{item.price}</td>
                            <td className="p-2 uppercase text-stone-500">{item.categoryId}</td>
                            <td className="p-2">{item.stockQuantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {csvPreviewProducts.length > 10 && (
                    <p className="text-[11px] text-stone-400 mt-1 italic">Showing first 10 of {csvPreviewProducts.length} items</p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button 
                  type="button" 
                  onClick={() => setIsCsvModalOpen(false)} 
                  className="px-5 py-2 text-stone-600 font-medium hover:bg-stone-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={csvPreviewProducts.length === 0 || csvImporting} 
                  onClick={handleImportCsv} 
                  className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2"
                >
                  {csvImporting ? 'Importing Products...' : `Import ${csvPreviewProducts.length} Products`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
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
                        <img loading="lazy" src={img.url} className="w-24 h-24 object-cover rounded shadow-sm border border-stone-300" />
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
