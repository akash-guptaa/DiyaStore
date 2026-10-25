'use client';
import { useState, useEffect, useMemo } from 'react';
import { Customer } from '@/types';
import Pagination from '@/components/Pagination';
import PinModal from '@/components/PinModal';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '', city: '' });
  const [saving, setSaving] = useState(false);

  // Multi-select state
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  // PIN security states
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  
  // Search, Sort & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'orders' | 'spent' | 'name' | 'newest'>('orders');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchCustomers = () => {
    fetch('/api/customers').then(r => r.json()).then(setCustomers);
  };

  useEffect(() => { fetchCustomers(); }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', mobile: '', email: '', city: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Customer) => {
    setEditingId(c.id);
    setFormData({ name: c.name, mobile: c.mobile, email: c.email || '', city: c.city || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (editingId) {
      await fetch('/api/customers/' + editingId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } else {
      await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    }
    
    setSaving(false);
    setIsModalOpen(false);
    fetchCustomers();
  };

  // Delete Prompt & Execution (PIN protected)
  const promptSingleDelete = (id: string) => {
    setCustomerToDelete(id);
    setIsPinModalOpen(true);
  };

  const promptBulkDelete = () => {
    if (selectedCustomerIds.length === 0) return;
    setCustomerToDelete(null);
    setIsPinModalOpen(true);
  };

  const handleConfirmedDelete = async () => {
    const idsToDelete = customerToDelete ? [customerToDelete] : selectedCustomerIds;
    if (idsToDelete.length === 0) return;

    if (idsToDelete.length === 1) {
      await fetch('/api/customers/' + idsToDelete[0], { method: 'DELETE' });
    } else {
      await fetch('/api/customers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete })
      });
    }

    setCustomers(prev => prev.filter(c => !idsToDelete.includes(c.id)));
    setSelectedCustomerIds(prev => prev.filter(id => !idsToDelete.includes(id)));
    setCustomerToDelete(null);
    fetchCustomers();
  };

  // Filtered and sorted customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchesName = c.name?.toLowerCase().includes(q);
      const matchesMobile = c.mobile?.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, ''));
      const matchesEmail = c.email?.toLowerCase().includes(q);
      const matchesCity = c.city?.toLowerCase().includes(q);
      return matchesName || matchesMobile || matchesEmail || matchesCity;
    }).sort((a, b) => {
      if (sortBy === 'orders') return (b.orderCount || 0) - (a.orderCount || 0);
      if (sortBy === 'spent') return (b.totalSpent || 0) - (a.totalSpent || 0);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });
  }, [customers, searchQuery, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedCustomerIds([]);
  }, [searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  // Checkbox helpers
  const allCurrentPageSelected = paginatedCustomers.length > 0 && paginatedCustomers.every(c => selectedCustomerIds.includes(c.id));

  const toggleSelectAllPage = () => {
    if (allCurrentPageSelected) {
      const pageIds = paginatedCustomers.map(c => c.id);
      setSelectedCustomerIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedCustomers.map(c => c.id);
      setSelectedCustomerIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectCustomer = (id: string) => {
    setSelectedCustomerIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const exportCSV = () => {
    const headers = ['Name', 'Mobile', 'Email', 'City', 'Orders', 'Total Spent'];
    const rows = filteredCustomers.map(c => [
      `"${(c.name || '').replace(/"/g, '""')}"`,
      c.mobile,
      c.email || '',
      `"${(c.city || '').replace(/"/g, '""')}"`,
      c.orderCount,
      c.totalSpent
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customers_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900">Customer List</h1>
          <p className="text-sm text-stone-500 mt-1">{customers.length} registered customers</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Bulk Delete Button when items selected */}
          {selectedCustomerIds.length > 0 && (
            <button
              onClick={promptBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2 text-sm animate-fadeIn"
            >
              <span>🗑️</span>
              <span>Delete Selected ({selectedCustomerIds.length})</span>
            </button>
          )}

          <button 
            onClick={exportCSV} 
            className="bg-white border border-stone-300 text-stone-700 px-4 py-2 rounded-lg font-medium hover:bg-stone-50 transition-colors shadow-2xs text-sm"
          >
            Download CSV
          </button>
          <button 
            onClick={openAddModal} 
            className="bg-rose-800 text-white px-5 py-2 rounded-lg font-medium hover:bg-rose-900 transition-colors shadow-sm text-sm"
          >
            + Add Customer
          </button>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-white p-4 rounded-xl shadow-2xs border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
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
            placeholder="Search by name, mobile, email, city..."
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

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs sm:text-sm text-stone-600">
          <span className="text-xs text-stone-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-stone-300 text-stone-800 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-rose-800 focus:border-rose-800 outline-none cursor-pointer"
          >
            <option value="orders">Most Orders</option>
            <option value="spent">Highest Spent</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Floating Bulk Action Indicator */}
      {selectedCustomerIds.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
            <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
              {selectedCustomerIds.length}
            </span>
            <span>customers selected across pages</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCustomerIds([])}
              className="text-xs text-stone-600 hover:text-stone-900 font-medium px-3 py-1 rounded hover:bg-amber-100/70"
            >
              Deselect All
            </button>
            <button
              onClick={promptBulkDelete}
              className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-2xs flex items-center gap-1.5"
            >
              <span>🗑️ Delete ({selectedCustomerIds.length})</span>
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-2xs border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-max border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs uppercase tracking-wider text-stone-600 font-bold">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={allCurrentPageSelected}
                    onChange={toggleSelectAllPage}
                    className="w-4 h-4 rounded text-rose-800 focus:ring-rose-800 cursor-pointer accent-[#8C432C]"
                    title="Select all visible customers on this page"
                  />
                </th>
                <th className="p-4">Customer</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Location</th>
                <th className="p-4 text-center">Orders</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paginatedCustomers.map((c: any) => {
                const isSelected = selectedCustomerIds.includes(c.id);
                return (
                  <tr 
                    key={c.id || c.mobile} 
                    className={`transition-colors ${isSelected ? 'bg-amber-50/50 hover:bg-amber-50/80' : 'hover:bg-stone-50/70'}`}
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectCustomer(c.id)}
                        className="w-4 h-4 rounded text-rose-800 focus:ring-rose-800 cursor-pointer accent-[#8C432C]"
                      />
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-stone-800">{c.name}</div>
                      {c.email && <div className="text-xs text-stone-400">{c.email}</div>}
                    </td>

                    <td className="p-4 text-stone-600 font-mono text-xs">
                      <a 
                        href={`https://wa.me/${c.mobile.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>💬</span>
                        <span>{c.mobile}</span>
                      </a>
                    </td>

                    <td className="p-4 text-xs text-stone-600">{c.city || 'N/A'}</td>

                    <td className="p-4 text-center">
                      <span className="font-bold text-xs bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full text-stone-700">
                        {c.orderCount || 0}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-rose-900">₹{c.totalSpent || 0}</td>

                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEditModal(c)} className="text-blue-600 hover:underline text-xs font-semibold">Edit</button>
                      <button 
                        onClick={() => promptSingleDelete(c.id)} 
                        className="text-red-600 hover:underline text-xs font-semibold"
                        title="Delete customer (requires PIN)"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-stone-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="text-3xl">👥</div>
                      <div className="font-semibold text-stone-700">No customers found</div>
                      <p className="text-xs text-stone-400">
                        {searchQuery ? 'Try adjusting your search terms.' : 'No customers yet.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredCustomers.length > 0 && (
          <div className="border-t border-stone-200 bg-stone-50/70 px-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCustomers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              pageSizeOptions={[10, 25, 50, 100]}
            />
          </div>
        )}
      </div>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 mb-4">{editingId ? 'Edit Customer' : 'Add Manual Customer'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Name *</label>
                <input required type="text" className="w-full border border-stone-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-rose-800 outline-none" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Mobile *</label>
                <input required type="text" className="w-full border border-stone-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-rose-800 outline-none" value={formData.mobile} onChange={e=>setFormData({...formData, mobile: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Email</label>
                <input type="email" className="w-full border border-stone-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-rose-800 outline-none" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">City</label>
                <input type="text" className="w-full border border-stone-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-rose-800 outline-none" value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-medium text-sm">Cancel</button>
                <button disabled={saving} type="submit" className="px-6 py-2 bg-rose-800 text-white rounded-lg font-medium shadow-sm hover:bg-rose-900 text-sm">{saving ? 'Saving...' : 'Save Customer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PIN Security Modal for Customer Deletion */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => { setIsPinModalOpen(false); setCustomerToDelete(null); }}
        onSuccess={handleConfirmedDelete}
        title={customerToDelete ? 'Confirm Customer Deletion' : `Delete ${selectedCustomerIds.length} Selected Customers`}
        description={
          customerToDelete 
            ? 'Please enter your 4-digit PIN to permanently delete this customer.'
            : `Please enter your 4-digit PIN to permanently delete ${selectedCustomerIds.length} selected customers.`
        }
        confirmButtonText="Delete Customer(s)"
        isDestructive={true}
      />
    </div>
  );
}
