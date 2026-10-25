'use client';
import { useState, useEffect, useMemo } from 'react';
import { Order } from '@/types';
import Pagination from '@/components/Pagination';
import PinModal from '@/components/PinModal';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  
  // Multi-select state
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // PIN security modal state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null); // null means bulk delete selected
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const fetchOrders = () => {
    fetch('/api/orders')
      .then(r => r.json())
      .then((data: Order[]) => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch(err => console.error('Failed to fetch orders:', err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    await fetch('/api/orders/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus as any } : o));
    setLoadingId(null);
  };

  // Filter and Sort orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // Status filter
      if (statusFilter !== 'all' && o.status !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = o.id?.toLowerCase().includes(q);
        const matchesName = o.customerName?.toLowerCase().includes(q);
        const matchesMobile = o.customerMobile?.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, ''));
        const matchesCity = o.customerCity?.toLowerCase().includes(q);
        const matchesItem = o.items?.some((item: any) => item.productName?.toLowerCase().includes(q));
        if (!matchesId && !matchesName && !matchesMobile && !matchesCity && !matchesItem) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
      if (sortBy === 'highest') {
        return (b.total || 0) - (a.total || 0);
      }
      if (sortBy === 'lowest') {
        return (a.total || 0) - (b.total || 0);
      }
      return 0;
    });
  }, [orders, statusFilter, searchQuery, sortBy]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedOrderIds([]);
  }, [searchQuery, statusFilter, sortBy]);

  // Paginated slice
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  // Checkbox selection helpers
  const allCurrentPageSelected = paginatedOrders.length > 0 && paginatedOrders.every(o => selectedOrderIds.includes(o.id));

  const toggleSelectAllPage = () => {
    if (allCurrentPageSelected) {
      const pageIds = paginatedOrders.map(o => o.id);
      setSelectedOrderIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedOrders.map(o => o.id);
      setSelectedOrderIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Delete Handlers with PIN Protection
  const promptSingleDelete = (id: string) => {
    setOrderToDelete(id);
    setIsPinModalOpen(true);
  };

  const promptBulkDelete = () => {
    if (selectedOrderIds.length === 0) return;
    setOrderToDelete(null);
    setIsPinModalOpen(true);
  };

  const executeConfirmedDelete = async () => {
    const idsToDelete = orderToDelete ? [orderToDelete] : selectedOrderIds;
    if (idsToDelete.length === 0) return;

    if (idsToDelete.length === 1) {
      await fetch('/api/orders/' + idsToDelete[0], { method: 'DELETE' });
    } else {
      await fetch('/api/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete })
      });
    }

    setOrders(prev => prev.filter(o => !idsToDelete.includes(o.id)));
    setSelectedOrderIds(prev => prev.filter(id => !idsToDelete.includes(id)));
    setOrderToDelete(null);
  };

  const exportCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Mobile', 'City', 'Total Amount', 'Status', 'Date'];
    const rows = filteredOrders.map(o => [
      o.id,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      o.customerMobile,
      `"${(o.customerCity || '').replace(/"/g, '""')}"`,
      o.total,
      o.status,
      new Date(o.createdAt || Date.now()).toLocaleDateString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${statusFilter}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNotifyWhatsApp = (order: Order) => {
    let message = '';
    const cleanMobile = order.customerMobile.replace(/[^0-9]/g, '');

    switch (order.status) {
      case 'pending_whatsapp_confirmation':
        message = 'Hello ' + order.customerName + ', we have received your order #' + order.id + ' for ₹' + order.total + '. We will confirm it shortly!';
        break;
      case 'confirmed':
        message = 'Hello ' + order.customerName + ', your order #' + order.id + ' for ₹' + order.total + ' is confirmed! We are preparing it for you.';
        break;
      case 'collect_from_shop':
        message = 'Hello ' + order.customerName + ', your order #' + order.id + ' is ready to collect from our shop! Please visit us during working hours.';
        break;
      case 'delivered':
        message = 'Hello ' + order.customerName + ', your order #' + order.id + ' has been delivered. Thank you for shopping with Diya Store!';
        break;
      case 'completed':
        message = 'Hello ' + order.customerName + ', your order #' + order.id + ' is now complete. We hope you love your products!';
        break;
      case 'cancelled':
        message = 'Hello ' + order.customerName + ', unfortunately your order #' + order.id + ' has been cancelled. Please let us know if you need any help.';
        break;
      default:
        message = 'Hello ' + order.customerName + ', regarding your order #' + order.id + ' for ₹' + order.total + '.';
    }

    const whatsappUrl = 'https://wa.me/' + cleanMobile + '?text=' + encodeURIComponent(message);
    window.open(whatsappUrl, '_blank');
  };

  // Status counts for quick badges
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    orders.forEach(o => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const statuses = [
    { key: 'all', label: 'All Orders' },
    { key: 'pending_whatsapp_confirmation', label: 'Pending WhatsApp' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'collect_from_shop', label: 'Collect from Shop' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900">Orders</h1>
          <p className="text-sm text-stone-500 mt-1">
            Manage incoming orders, update dispatch statuses, and send WhatsApp updates
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Bulk Delete Button when items selected */}
          {selectedOrderIds.length > 0 && (
            <button
              onClick={promptBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2 text-sm animate-fadeIn"
            >
              <span>🗑️</span>
              <span>Delete Selected ({selectedOrderIds.length})</span>
            </button>
          )}

          <button 
            onClick={exportCSV} 
            className="bg-white border border-stone-300 text-stone-700 px-4 py-2 rounded-lg font-medium hover:bg-stone-50 transition-colors shadow-2xs flex items-center gap-2 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export CSV ({filteredOrders.length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-2xs border border-stone-200 space-y-4">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 pb-3">
          {statuses.map(st => {
            const count = statusCounts[st.key] || 0;
            const isActive = statusFilter === st.key;
            return (
              <button
                key={st.key}
                onClick={() => setStatusFilter(st.key)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-rose-900 text-white shadow-2xs font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{st.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search box */}
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
              placeholder="Search by order ID, name, mobile, city..."
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

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs sm:text-sm text-stone-600">
            <span className="text-xs text-stone-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-300 text-stone-800 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-rose-800 focus:border-rose-800 outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Indicator */}
      {selectedOrderIds.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
            <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
              {selectedOrderIds.length}
            </span>
            <span>orders selected across pages</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedOrderIds([])}
              className="text-xs text-stone-600 hover:text-stone-900 font-medium px-3 py-1 rounded hover:bg-amber-100/70"
            >
              Deselect All
            </button>
            <button
              onClick={promptBulkDelete}
              className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-2xs flex items-center gap-1.5"
            >
              <span>🗑️ Delete ({selectedOrderIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Orders Table Container */}
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
                    title="Select all visible orders on this page"
                  />
                </th>
                <th className="p-4 w-28">Order ID</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Ordered Items</th>
                <th className="p-4 w-28">Total</th>
                <th className="p-4 w-60">Status & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paginatedOrders.map(o => {
                const isSelected = selectedOrderIds.includes(o.id);
                return (
                  <tr 
                    key={o.id} 
                    className={`transition-colors ${isSelected ? 'bg-amber-50/50 hover:bg-amber-50/80' : 'hover:bg-stone-50/70'}`}
                  >
                    <td className="p-4 text-center align-top">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOrder(o.id)}
                        className="w-4 h-4 rounded text-rose-800 focus:ring-rose-800 cursor-pointer accent-[#8C432C]"
                      />
                    </td>

                    <td className="p-4 align-top">
                      <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2 py-1 rounded border border-stone-200 inline-block">
                        #{o.id}
                      </span>
                      <div className="text-[11px] text-stone-400 mt-1.5">
                        {new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>

                    <td className="p-4 align-top">
                      <div className="font-bold text-stone-800">{o.customerName}</div>
                      <div className="text-xs text-stone-600 font-mono mt-0.5">{o.customerMobile}</div>
                      {(o.customerCity || o.customerState) && (
                        <div className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                          <span>📍</span>
                          <span>{[o.customerCity, o.customerState].filter(Boolean).join(', ')}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-4 align-top">
                      <div className="space-y-1 max-w-sm">
                        {(o.items || [{ productName: o.productName, quantity: o.quantity }]).map((i: any, idx: number) => (
                          <div key={idx} className="text-xs bg-stone-50 px-2 py-1 rounded border border-stone-200 flex items-center justify-between gap-2">
                            <span className="text-stone-800 truncate">{i.productName}</span>
                            <span className="font-mono font-bold text-stone-600 bg-white px-1.5 py-0.2 rounded border border-stone-200 text-[10px]">
                              {i.quantity}x
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 align-top font-bold text-rose-900 text-base">
                      ₹{o.total}
                    </td>

                    <td className="p-4 align-top">
                      <div className="flex flex-col gap-2 max-w-[210px]">
                        <select 
                          disabled={loadingId === o.id}
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className="border border-stone-300 rounded-lg p-1.5 text-xs bg-white shadow-2xs w-full focus:ring-1 focus:ring-rose-800 focus:border-rose-800 outline-none"
                        >
                          <option value="pending_whatsapp_confirmation">Pending WhatsApp</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="collect_from_shop">Collect from shop</option>
                          <option value="delivered">Delivered</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => handleNotifyWhatsApp(o)}
                            className="flex-1 bg-emerald-600 text-white text-xs py-1.5 px-2.5 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 shadow-2xs font-semibold"
                            title="Send order status message on WhatsApp"
                          >
                            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                            <span>WhatsApp</span>
                          </button>

                          {/* Single Order Delete with PIN */}
                          <button
                            onClick={() => promptSingleDelete(o.id)}
                            className="bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 border border-stone-300 hover:border-red-300 p-1.5 rounded-lg transition-colors text-xs"
                            title="Delete this order (requires 4-digit PIN)"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-stone-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="text-3xl">📦</div>
                      <div className="font-semibold text-stone-700">No orders found</div>
                      <p className="text-xs text-stone-400">
                        {searchQuery || statusFilter !== 'all' 
                          ? 'Try adjusting your search terms or status filter.' 
                          : 'No orders have been placed yet.'}
                      </p>
                      {(searchQuery || statusFilter !== 'all') && (
                        <button
                          onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                          className="mt-2 text-xs font-semibold text-rose-800 hover:underline"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredOrders.length > 0 && (
          <div className="border-t border-stone-200 bg-stone-50/70 px-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredOrders.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              pageSizeOptions={[10, 25, 50, 100]}
            />
          </div>
        )}
      </div>

      {/* PIN Security Modal for Order Deletion */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => { setIsPinModalOpen(false); setOrderToDelete(null); }}
        onSuccess={executeConfirmedDelete}
        title={orderToDelete ? 'Confirm Order Deletion' : `Delete ${selectedOrderIds.length} Selected Orders`}
        description={
          orderToDelete 
            ? `Please enter your 4-digit PIN to permanently delete order #${orderToDelete}.`
            : `Please enter your 4-digit PIN to permanently delete ${selectedOrderIds.length} selected orders.`
        }
        confirmButtonText="Delete Order(s)"
        isDestructive={true}
      />
    </div>
  );
}
