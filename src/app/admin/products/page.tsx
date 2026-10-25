'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Product, ProductImage } from '@/types';
import Pagination from '@/components/Pagination';
import PinModal from '@/components/PinModal';
import { BADGE_OPTIONS, getBadgeColors } from '@/components/ProductBadge';

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

  // Multi-select state
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // PIN security states
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinAction, setPinAction] = useState<'delete_single' | 'delete_bulk' | 'unlock_inventory'>('delete_single');
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isInventoryUnlocked, setIsInventoryUnlocked] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    productCode: '',
    shortDescription: '',
    description: '',
    price: '',
    salePrice: '',
    inventoryPrice: '',
    badge: '',
    isNewArrival: false,
    categoryId: '',
    stockQuantity: '10',
    images: [] as ProductImage[]
  });
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  // Search, Filter & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [badgeFilter, setBadgeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.categoryId || 'terracotta').filter(Boolean)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (categoryFilter !== 'all' && (p.categoryId || 'terracotta') !== categoryFilter) {
        return false;
      }
      if (stockFilter === 'in_stock' && (p.stockQuantity || 0) <= 0) return false;
      if (stockFilter === 'out_of_stock' && (p.stockQuantity || 0) > 0) return false;

      if (badgeFilter !== 'all') {
        const currentBadge = (p.badge || (p.isNewArrival ? 'New Arrival' : '')).trim();
        if (badgeFilter === 'none') {
          if (currentBadge !== '') return false;
        } else {
          if (currentBadge.toLowerCase() !== badgeFilter.toLowerCase()) return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name?.toLowerCase().includes(q);
        const matchesCode = p.productCode?.toLowerCase().includes(q);
        const matchesCat = p.categoryId?.toLowerCase().includes(q);
        const matchesBadge = p.badge?.toLowerCase().includes(q);
        const matchesDesc = p.shortDescription?.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesCat && !matchesBadge && !matchesDesc) return false;
      }
      return true;
    });
  }, [products, categoryFilter, stockFilter, badgeFilter, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedProductIds([]);
  }, [searchQuery, categoryFilter, stockFilter, badgeFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Checkbox helpers
  const allCurrentPageSelected = paginatedProducts.length > 0 && paginatedProducts.every(p => selectedProductIds.includes(p.id));

  const toggleSelectAllPage = () => {
    if (allCurrentPageSelected) {
      const pageIds = paginatedProducts.map(p => p.id);
      setSelectedProductIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedProducts.map(p => p.id);
      setSelectedProductIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const fetchProducts = () => {
    fetch('/api/products?includeDrafts=true')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); });
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFilesToUpload(Array.from(e.target.files));
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ 
      name: '', 
      productCode: '', 
      shortDescription: '', 
      description: '', 
      price: '', 
      salePrice: '', 
      inventoryPrice: '',
      badge: '',
      isNewArrival: false,
      categoryId: '', 
      stockQuantity: '10', 
      images: [] 
    });
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
      inventoryPrice: product.inventoryPrice !== undefined && product.inventoryPrice !== null ? String(product.inventoryPrice) : '',
      badge: product.badge || (product.isNewArrival ? 'New Arrival' : ''),
      isNewArrival: !!product.isNewArrival,
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
      inventoryPrice: formData.inventoryPrice !== '' ? Number(formData.inventoryPrice) : null,
      badge: formData.badge.trim() || '',
      isNewArrival: formData.badge.trim().toLowerCase().includes('new') || formData.isNewArrival,
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

  // Delete Prompt & Execution (PIN protected)
  const promptSingleDelete = (id: string) => {
    setProductToDelete(id);
    setPinAction('delete_single');
    setIsPinModalOpen(true);
  };

  const promptBulkDelete = () => {
    if (selectedProductIds.length === 0) return;
    setProductToDelete(null);
    setPinAction('delete_bulk');
    setIsPinModalOpen(true);
  };

  const promptUnlockInventory = () => {
    setPinAction('unlock_inventory');
    setIsPinModalOpen(true);
  };

  const handlePinSuccess = async () => {
    if (pinAction === 'unlock_inventory') {
      setIsInventoryUnlocked(true);
      return;
    }

    const idsToDelete = productToDelete ? [productToDelete] : selectedProductIds;
    if (idsToDelete.length === 0) return;

    if (idsToDelete.length === 1) {
      await fetch('/api/products/' + idsToDelete[0], { method: 'DELETE' });
    } else {
      await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete })
      });
    }

    setProducts(prev => prev.filter(p => !idsToDelete.includes(p.id)));
    setSelectedProductIds(prev => prev.filter(id => !idsToDelete.includes(id)));
    setProductToDelete(null);
  };

  const exportCSV = () => {
    const headers = ['Code', 'Name', 'Price', 'Sale Price', 'Stock', 'Status', 'Category', 'Badge', 'Description'];
    const rows = filteredProducts.map(p => [
      `"${p.productCode || ''}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      p.price,
      p.salePrice || '',
      p.stockQuantity,
      `"${p.status || ''}"`,
      `"${p.categoryId || ''}"`,
      `"${p.badge || (p.isNewArrival ? 'New Arrival' : '')}"`,
      `"${(p.description || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `products_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSampleTemplate = () => {
    const headers = ['Code', 'Name', 'Price', 'Sale Price', 'Stock', 'Category', 'Badge', 'Short Description', 'Description', 'Image URL'];
    const sampleRows = [
      ['"DIYA-201"', '"Royal Mayur Brass Peacock Diya"', '1299', '999', '40', '"brass"', '"Best Sale"', '"Exquisite handcrafted brass peacock diya"', '"Traditional brass deepam with five oil wells and royal feather engravings"', '"/uploads/peacock_brass_diya.jpg"'],
      ['"DIYA-202"', '"Handmade Lotus Terracotta Diya"', '349', '249', '80', '"terracotta"', '"New Arrival"', '"Pink lotus petal clay diya with glitter"', '"Multi-layered blooming lotus diya hand-painted with gold highlights"', '"/uploads/blooming_lotus_diya_1.jpg"'],
      ['"DIYA-203"', '"Auspicious Shubh Labh Hanging Diya Pair"', '399', '299', '50', '"terracotta"', '"Sale in 24 hours"', '"Door hanging clay diya pair with bells and loops"', '"Sacred Shubh Labh earthen diya pair for entrance and puja altar"', '"/uploads/shubh_labh_diya_1.jpg"'],
      ['"DIYA-204"', '"Royal Crystal Kundan Aarti Thali"', '899', '699', '30', '"designer"', '"Best Value"', '"Sparkling puja plate with 5 diya holders"', '"Premium kundan stone embellished brass thali"', '"/uploads/kundan_aarti_thali.jpg"']
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
        else if (h.includes('badge')) obj.badge = val;
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

  if (loading) return <div className="p-8">Loading products...</div>;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {importNotification && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg flex items-center justify-between">
          <span className="font-semibold">✓ {importNotification}</span>
          <button onClick={() => setImportNotification(null)} className="text-emerald-800 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900">Products Catalog</h1>
          <p className="text-sm text-stone-500 mt-1">{products.length} total products in catalog</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Bulk Delete Button when items selected */}
          {selectedProductIds.length > 0 && (
            <button
              onClick={promptBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2 text-sm animate-fadeIn"
            >
              <span>🗑️</span>
              <span>Delete Selected ({selectedProductIds.length})</span>
            </button>
          )}

          {/* Toggle PIN Unlock for Inventory Price across table */}
          <button
            onClick={() => {
              if (isInventoryUnlocked) {
                setIsInventoryUnlocked(false);
              } else {
                promptUnlockInventory();
              }
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              isInventoryUnlocked 
                ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200' 
                : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
            }`}
            title="Enter 4-digit PIN to show/hide internal inventory cost prices"
          >
            <span>{isInventoryUnlocked ? '🔓 Cost Price: Visible' : '🔒 Cost Price: Locked'}</span>
          </button>

          <button 
            onClick={() => { setIsCsvModalOpen(true); setCsvPreviewProducts([]); setCsvFileName(''); setCsvError(null); }} 
            className="bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-800 transition-colors shadow-sm flex items-center gap-2 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload CSV
          </button>
          
          <button onClick={exportCSV} className="bg-white border border-stone-300 text-stone-700 px-4 py-2 rounded-lg font-medium hover:bg-stone-50 transition-colors text-sm shadow-2xs">
            Export CSV
          </button>
          
          <button onClick={openAddModal} className="bg-rose-800 text-white px-5 py-2 rounded-lg font-medium hover:bg-rose-900 transition-colors shadow-sm text-sm">
            + Add Product
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-2xs border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by code, name, badge..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-rose-800 focus:border-rose-800 outline-none transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <span className="text-stone-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 outline-none focus:ring-1 focus:ring-rose-800"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <span className="text-stone-400">Stock:</span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 outline-none focus:ring-1 focus:ring-rose-800"
            >
              <option value="all">All Stock Status</option>
              <option value="in_stock">In Stock (&gt; 0)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>
          </div>

          {/* Badge Filter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <span className="text-stone-400">Badge:</span>
            <select
              value={badgeFilter}
              onChange={(e) => setBadgeFilter(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 outline-none focus:ring-1 focus:ring-rose-800"
            >
              <option value="all">All Badges</option>
              <option value="New Arrival">✨ New Arrival</option>
              <option value="Best Sale">🔥 Best Sale</option>
              <option value="Best Value">💎 Best Value</option>
              <option value="Sale in 24 hours">⚡ Sale in 24 hours</option>
              <option value="none">No Badge</option>
            </select>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Indicator */}
      {selectedProductIds.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
            <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
              {selectedProductIds.length}
            </span>
            <span>products selected across pages</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedProductIds([])}
              className="text-xs text-stone-600 hover:text-stone-900 font-medium px-3 py-1 rounded hover:bg-amber-100/70"
            >
              Deselect All
            </button>
            <button
              onClick={promptBulkDelete}
              className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-2xs flex items-center gap-1.5"
            >
              <span>🗑️ Delete ({selectedProductIds.length})</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Products Table Container */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-2xs border border-stone-200">
        <table className="w-full text-left min-w-max border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-xs uppercase tracking-wider text-stone-600 font-bold">
              <th className="p-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={allCurrentPageSelected}
                  onChange={toggleSelectAllPage}
                  className="w-4 h-4 rounded text-rose-800 focus:ring-rose-800 cursor-pointer accent-[#8C432C]"
                  title="Select all visible products on this page"
                />
              </th>
              <th className="p-4 w-16">Image</th>
              <th className="p-4">Code</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price / MRP</th>
              <th className="p-4">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => !isInventoryUnlocked && promptUnlockInventory()}>
                  <span>Cost Price</span>
                  <span className="text-[10px]">{isInventoryUnlocked ? '🔓' : '🔒'}</span>
                </div>
              </th>
              <th className="p-4">Stock</th>
              <th className="p-4">Badge</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {paginatedProducts.map(p => {
              const isSelected = selectedProductIds.includes(p.id);
              const badgeText = p.badge || (p.isNewArrival ? 'New Arrival' : '');

              return (
                <tr 
                  key={p.id} 
                  className={`transition-colors ${isSelected ? 'bg-amber-50/50 hover:bg-amber-50/80' : 'hover:bg-stone-50/70'}`}
                >
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectProduct(p.id)}
                      className="w-4 h-4 rounded text-rose-800 focus:ring-rose-800 cursor-pointer accent-[#8C432C]"
                    />
                  </td>

                  <td className="p-4">
                    {p.images?.[0] ? (
                      <img loading="lazy" src={p.images[0].url} alt={p.name} className="w-12 h-12 object-cover rounded shadow-2xs border border-stone-200" />
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

                  {/* Masked / Unlocked Inventory Cost Price */}
                  <td className="p-4 text-xs font-mono">
                    {isInventoryUnlocked ? (
                      <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        ₹{p.inventoryPrice !== undefined && p.inventoryPrice !== null ? p.inventoryPrice : '—'}
                      </span>
                    ) : (
                      <button
                        onClick={promptUnlockInventory}
                        className="text-stone-400 hover:text-stone-700 text-xs flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded border border-stone-200"
                        title="Click to enter PIN and view cost price"
                      >
                        <span>••••</span>
                        <span className="text-[10px]">🔒</span>
                      </button>
                    )}
                  </td>

                  <td className="p-4">
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${p.stockQuantity > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {p.stockQuantity} in stock
                    </span>
                  </td>

                  {/* Badge Column */}
                  <td className="p-4">
                    {badgeText ? (
                      <span className={`inline-flex items-center gap-1 border text-[10px] px-2 py-0.5 rounded uppercase tracking-wider ${getBadgeColors(badgeText).admin}`}>
                        <span>{getBadgeColors(badgeText).icon}</span>
                        <span>{badgeText}</span>
                      </span>
                    ) : (
                      <span className="text-stone-300 text-xs">—</span>
                    )}
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openEditModal(p)} className="text-blue-600 font-semibold hover:underline text-xs">Edit</button>
                    <button 
                      onClick={() => promptSingleDelete(p.id)} 
                      className="text-red-600 font-semibold hover:underline text-xs"
                      title="Delete product (requires PIN)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredProducts.length === 0 && (
              <tr><td colSpan={10} className="p-12 text-center text-stone-500">No products found.</td></tr>
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        {filteredProducts.length > 0 && (
          <div className="border-t border-stone-200 bg-stone-50/70 px-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              pageSizeOptions={[10, 25, 50, 100]}
            />
          </div>
        )}
      </div>

      {/* CSV Upload / Import Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-stone-200">
            <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-stone-50 sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-stone-900">Import Products from CSV</h2>
                <p className="text-xs text-stone-500">Upload a CSV file to bulk import products into your store catalog</p>
              </div>
              <button onClick={() => setIsCsvModalOpen(false)} className="text-stone-400 hover:text-stone-800 text-2xl font-bold px-2 leading-none">&times;</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Template Download Box */}
              <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-900 text-sm">Need a starter template?</div>
                  <div className="text-xs text-amber-700">Download our sample CSV with the correct columns and sample products.</div>
                </div>
                <button 
                  onClick={downloadSampleTemplate} 
                  className="bg-amber-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors shadow-2xs"
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
                <p className="text-xs text-stone-400 mt-1">Supports standard CSV with Code, Name, Price, Category, Badge, and Description</p>
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
                  className="px-5 py-2 text-stone-600 font-medium hover:bg-stone-100 rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  disabled={csvPreviewProducts.length === 0 || csvImporting} 
                  onClick={handleImportCsv} 
                  className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2 text-sm"
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
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-stone-200">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl md:text-2xl font-bold text-stone-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-800 text-2xl font-bold px-2 leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Image Upload Section */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <h3 className="font-semibold mb-2 text-sm text-stone-800">Product Images</h3>
                
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-4 mb-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img loading="lazy" src={img.url} className="w-24 h-24 object-cover rounded-lg shadow-2xs border border-stone-300" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-medium mb-1 text-stone-600">Upload New Images</label>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="block w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-800 hover:file:bg-rose-100 cursor-pointer" />
                </div>
              </div>

              {/* Name & Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Product Name *</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-stone-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-rose-800 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Product Code *</label>
                  <input required type="text" name="productCode" value={formData.productCode} onChange={handleChange} className="w-full border border-stone-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-rose-800 outline-none font-mono" placeholder="e.g. DIYA-001" />
                </div>
              </div>

              {/* Price, Sale Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Retail Price (₹) *</label>
                  <input required type="number" min="0" name="price" value={formData.price} onChange={handleChange} className="w-full border border-stone-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-rose-800 outline-none font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Sale Price (₹)</label>
                  <input type="number" min="0" name="salePrice" value={formData.salePrice} onChange={handleChange} className="w-full border border-stone-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-rose-800 outline-none text-rose-900 font-bold" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Stock Qty *</label>
                  <input required type="number" min="0" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="w-full border border-stone-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-rose-800 outline-none font-bold" />
                </div>
              </div>

              {/* Category & Badge Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Category</label>
                  <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full border border-stone-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-rose-800 outline-none">
                    <option value="">Select a category</option>
                    <option value="terracotta">Terracotta</option>
                    <option value="brass">Brass</option>
                    <option value="designer">Designer / Hand-painted</option>
                    <option value="festive">Festive Sets</option>
                    <option value="candles">Wax Candles</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">Product Badge (Shown on storefront)</label>
                    {formData.badge && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, badge: '' })}
                        className="text-[11px] text-stone-400 hover:text-red-600 underline font-semibold"
                      >
                        Clear Badge
                      </button>
                    )}
                  </div>

                  {/* Primary Dropdown with the 4 options */}
                  <select
                    value={['', 'New Arrival', 'Best Sale', 'Best Value', 'Sale in 24 hours'].includes(formData.badge) ? formData.badge : 'custom'}
                    onChange={(e) => {
                      if (e.target.value !== 'custom') {
                        setFormData({ ...formData, badge: e.target.value });
                      }
                    }}
                    className="w-full border border-stone-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-rose-800 outline-none bg-white font-medium mb-2"
                  >
                    <option value="">-- No Badge --</option>
                    <option value="New Arrival">✨ New Arrival</option>
                    <option value="Best Sale">🔥 Best Sale</option>
                    <option value="Best Value">💎 Best Value</option>
                    <option value="Sale in 24 hours">⚡ Sale in 24 hours</option>
                    <option value="custom">✏️ Custom Badge...</option>
                  </select>

                  {/* Quick Select Pill Buttons */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {BADGE_OPTIONS.map((opt) => {
                      const isSelected = formData.badge.trim().toLowerCase() === opt.toLowerCase();
                      const colors = getBadgeColors(opt);
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setFormData({ ...formData, badge: isSelected ? '' : opt })}
                          className={`text-xs font-bold px-2.5 py-1 rounded-md border transition-all flex items-center gap-1 ${
                            isSelected 
                              ? `${colors.pill} shadow-xs scale-102` 
                              : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                          }`}
                        >
                          <span>{colors.icon}</span>
                          <span>{opt}</span>
                          {isSelected && <span className="ml-0.5 text-xs">✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom badge text input */}
                  <input 
                    type="text" 
                    name="badge" 
                    value={formData.badge} 
                    onChange={handleChange} 
                    className="w-full border border-stone-200 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-rose-800 outline-none text-stone-700" 
                    placeholder="Or type custom badge name" 
                  />
                </div>
              </div>

              {/* 🔒 INVENTORY COST PRICE (PROTECTED WITH 4-DIGIT PIN) */}
              <div className="bg-amber-50/70 border border-amber-300/80 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-amber-900">
                    <span>{isInventoryUnlocked ? '🔓' : '🔒'}</span>
                    <span>Internal Inventory Cost Price</span>
                    <span className="text-[10px] text-amber-700 font-normal lowercase">(strictly hidden from customers)</span>
                  </div>
                  {!isInventoryUnlocked && (
                    <button
                      type="button"
                      onClick={promptUnlockInventory}
                      className="text-xs bg-amber-800 hover:bg-amber-900 text-white font-semibold px-3 py-1 rounded-lg transition-colors shadow-2xs"
                    >
                      Enter PIN to View/Edit
                    </button>
                  )}
                </div>

                {isInventoryUnlocked ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-500 font-bold">₹</span>
                      <input
                        type="number"
                        min="0"
                        name="inventoryPrice"
                        value={formData.inventoryPrice}
                        onChange={handleChange}
                        placeholder="e.g. 150 (your purchase/cost price)"
                        className="w-full max-w-xs border border-amber-300 rounded-lg p-2 text-sm font-bold text-amber-900 bg-white focus:ring-1 focus:ring-amber-800 outline-none font-mono"
                      />
                    </div>
                    <p className="text-[11px] text-amber-800">
                      This internal cost price is completely hidden and will NEVER be rendered on product cards or customer pages.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-white/70 p-3 rounded-lg border border-amber-200">
                    <span className="font-mono text-sm tracking-widest text-stone-400">••••••••</span>
                    <span className="text-xs text-amber-800 font-medium">Locked with 4-digit PIN (default: 1234)</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Short Description</label>
                <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full border border-stone-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-rose-800 outline-none" maxLength={150} />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Full Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border border-stone-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-rose-800 outline-none h-24"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-stone-600 font-medium hover:bg-stone-100 rounded-lg text-sm transition-colors">
                  Cancel
                </button>
                <button disabled={saving} type="submit" className="bg-rose-800 hover:bg-rose-900 text-white px-8 py-2 rounded-lg font-bold shadow-sm transition-colors text-sm">
                  {saving ? 'Saving...' : (editingId ? 'Update Product' : 'Publish Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PIN Security Modal for Product Deletion & Inventory Price Unlock */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => { setIsPinModalOpen(false); setProductToDelete(null); }}
        onSuccess={handlePinSuccess}
        title={
          pinAction === 'unlock_inventory'
            ? 'Unlock Inventory Cost Price'
            : productToDelete
            ? 'Confirm Product Deletion'
            : `Delete ${selectedProductIds.length} Selected Products`
        }
        description={
          pinAction === 'unlock_inventory'
            ? 'Enter your 4-digit PIN to view and edit internal inventory cost prices.'
            : productToDelete
            ? 'Please enter your 4-digit PIN to permanently delete this product.'
            : `Please enter your 4-digit PIN to permanently delete ${selectedProductIds.length} selected products.`
        }
        confirmButtonText={pinAction === 'unlock_inventory' ? 'Unlock Price' : 'Delete Product(s)'}
        isDestructive={pinAction !== 'unlock_inventory'}
      />
    </div>
  );
}
