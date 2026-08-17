import { useEffect, useState } from 'react';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { api } from '../lib/api';
import { date, money, statusLabel } from '../lib/format';
import type { Order, OrderStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import OrderDrawer from '../components/OrderDrawer';
import PageHeader from '../components/PageHeader';

const ALL_STATUSES = ['ALL', 'NEW', 'CONFIRMED', 'VENDOR_ASSIGNED', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED'] as const;
type FilterStatus = (typeof ALL_STATUSES)[number];

const TAB_LABELS: Record<FilterStatus, string> = {
  ALL: 'All', NEW: 'New', CONFIRMED: 'Confirmed', VENDOR_ASSIGNED: 'Assigned',
  PROCESSING: 'Processing', DISPATCHED: 'Dispatched', DELIVERED: 'Delivered', CANCELLED: 'Cancelled',
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<FilterStatus>('ALL');
  const [selected, setSelected] = useState<string>();
  const [counts, setCounts] = useState<Partial<Record<FilterStatus, number>>>({});

  const load = () => api.orders(search, status).then(orders => {
    setOrders(orders);
    if (!search) {
      const map: Partial<Record<FilterStatus, number>> = { ALL: orders.length };
      orders.forEach(o => { map[o.status as FilterStatus] = (map[o.status as FilterStatus] ?? 0) + 1; });
      setCounts(prev => status === 'ALL' ? map : prev);
    }
  });

  useEffect(() => { const t = setTimeout(load, 150); return () => clearTimeout(t); }, [search, status]);

  return (
    <>
      <PageHeader
        eyebrow="Order Management"
        title="Orders"
        subtitle="Manage customer requirements, vendor assignments and fulfilment."
        action={
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            <Plus size={15} />
            New Order
          </button>
        }
      />

      {/* Status tabs */}
      <div className="mt-5 flex items-end gap-0 overflow-x-auto border-b border-slate-200">
        {ALL_STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              status === s
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {TAB_LABELS[s]}
            {counts[s] !== undefined && (
              <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                status === s ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {counts[s]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <div className="mt-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID, customer, location or vendor…"
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xs"
          />
        </div>
        <button className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 shadow-xs transition-colors hover:bg-slate-50">
          <SlidersHorizontal size={14} />
          Filters
        </button>
        <span className="text-xs text-slate-400">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Order ID</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Customer</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Materials</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Required By</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Value</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Vendor</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Executive</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map(o => (
                <tr
                  key={o.id}
                  onClick={() => setSelected(o.id)}
                  className="cursor-pointer transition-colors hover:bg-slate-50 group"
                >
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-blue-600 group-hover:underline">{o.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-900">{o.customerName}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{o.deliveryLocation}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-700">{o.items.length} item{o.items.length > 1 ? 's' : ''}</p>
                    <p className="mt-0.5 max-w-[180px] truncate text-xs text-slate-400">{o.items.map(i => i.name).join(', ')}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">{date(o.requiredDate)}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{money(o.value)}</td>
                  <td className="px-5 py-3.5">
                    {o.assignedVendorName
                      ? <span className="text-slate-700">{o.assignedVendorName}</span>
                      : <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">Assign vendor</span>
                    }
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{o.assignedExecutive}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={o.status as OrderStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <Search size={20} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-700">No orders found</p>
            <p className="text-xs text-slate-400">Try changing filters or search terms</p>
          </div>
        )}
      </div>

      <OrderDrawer orderId={selected} onClose={() => setSelected(undefined)} onChanged={load} />
    </>
  );
}
