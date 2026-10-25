'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import AddToCartButton from '@/components/AddToCartButton';
import Pagination from '@/components/Pagination';

interface ProductCollectionProps {
  products: Product[];
}

export default function ProductCollection({ products }: ProductCollectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.categoryId) cats.add(p.categoryId);
    });
    return Array.from(cats);
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'all' && (p.categoryId || '').toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name?.toLowerCase().includes(q);
        const matchesCode = p.productCode?.toLowerCase().includes(q);
        const matchesDesc = p.shortDescription?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesDesc) return false;
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  // Total pages & paginated items
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Category Pills & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-2">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-rose-900 text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Diyas ({products.length})
          </button>
          {categories.map(cat => {
            const count = products.filter(p => (p.categoryId || '').toLowerCase() === cat.toLowerCase()).length;
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all ${
                  isSelected
                    ? 'bg-rose-900 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search diyas..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-full focus:bg-white focus:ring-1 focus:ring-rose-800 focus:border-rose-800 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-stone-400 hover:text-stone-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {paginatedProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col border border-stone-200">
            <Link href={'/product/' + (product.slug || product.id)} className="flex-1">
              <div className="relative aspect-square bg-stone-100">
                {(product.badge || product.isNewArrival) && (
                  <span className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded shadow-sm">
                    {product.badge || 'New Arrival'}
                  </span>
                )}
                {product.images && product.images.length > 0 && (
                  <img loading="lazy" src={product.images[0].url} alt={product.images[0].alt || product.name} className="object-cover w-full h-full" />
                )}
              </div>
              <div className="p-4">
                <div className="text-xs text-stone-500 mb-1">{product.productCode}</div>
                <h3 className="font-semibold text-stone-900 mb-2 truncate" title={product.name}>{product.name}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-rose-900">₹{product.salePrice || product.price}</span>
                  {product.salePrice && (
                    <span className="text-xs line-through text-stone-400">₹{product.price}</span>
                  )}
                </div>
              </div>
            </Link>
            <div className="px-4 pb-4">
              <AddToCartButton product={product} />
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="py-16 text-center text-stone-500 space-y-3 bg-white rounded-xl border border-stone-200">
          <div className="text-4xl">🪔</div>
          <div className="font-bold text-stone-700">No diyas found</div>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            We couldn't find any products matching your search. Try browsing all categories.
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="px-4 py-2 bg-rose-800 text-white text-xs font-semibold rounded-lg hover:bg-rose-900 transition-colors"
          >
            Show All Products
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {filteredProducts.length > 0 && (
        <div className="pt-4 border-t border-stone-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
            pageSizeOptions={[8, 12, 24, 48]}
          />
        </div>
      )}
    </div>
  );
}
