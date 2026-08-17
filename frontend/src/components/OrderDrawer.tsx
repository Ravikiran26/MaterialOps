import { useEffect, useMemo, useState } from 'react';
import {
  Building2, CalendarDays, Check, CheckCircle2, ChevronRight,
  MapPin, MessageSquare, Phone, Search, Send, Star, UserRound, X,
} from 'lucide-react';
import { api } from '../lib/api';
import { date, money } from '../lib/format';
import type { Order, OrderStatus, Vendor } from '../types';
import StatusBadge from './StatusBadge';
import OrderTimeline from './OrderTimeline';

const STATUS_OPTIONS: OrderStatus[] = [
  'NEW', 'CONFIRMED', 'VENDOR_ASSIGNED', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED',
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: 'New', CONFIRMED: 'Confirmed', VENDOR_ASSIGNED: 'Vendor Assigned',
  PROCESSING: 'Processing', DISPATCHED: 'Dispatched', DELIVERED: 'Delivered', CANCELLED: 'Cancelled',
};

type Tab = 'details' | 'vendor' | 'timeline';

export default function OrderDrawer({
  orderId, onClose, onChanged,
}: { orderId?: string; onClose: () => void; onChanged: () => void }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorId, setVendorId] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>('details');

  useEffect(() => {
    if (!orderId) { setOrder(null); setTab('details'); return; }
    Promise.all([api.order(orderId), api.vendors()]).then(([o, v]) => {
      setOrder(o);
      setVendors(v.filter(x => x.active));
      setVendorId(o.assignedVendorId || '');
    });
  }, [orderId]);

  const whatsapp = useMemo(() => {
    if (!order) return '#';
    const lines = order.items.map(i => `• ${i.name} — ${i.quantity} ${i.unit}`).join('\n');
    const text = [
      `*Order ${order.id}*`,
      `Customer: ${order.customerName}`,
      `Contact: ${order.contactPerson} (${order.phone})`,
      `Delivery: ${order.deliveryLocation}`,
      `Required by: ${order.requiredDate}`,
      ``,
      `*Materials:*`,
      lines,
      ``,
      `*Estimated Value: ${money(order.value)}*`,
      ``,
      `— MaterialOps, Hyderabad Operations`,
    ].join('\n');
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [order]);

  if (!orderId) return null;

  async function assign() {
    if (!order || !vendorId) return;
    setBusy(true);
    const updated = await api.assignVendor(order.id, vendorId);
    setOrder(updated); setBusy(false); onChanged();
  }

  async function changeStatus(status: OrderStatus) {
    if (!order) return;
    setBusy(true);
    const updated = await api.updateStatus(order.id, status);
    setOrder(updated); setBusy(false); onChanged();
  }

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in" onMouseDown={onClose}>
      <div className="flex-1 bg-slate-950/40 backdrop-blur-[2px]" />
      <div
        className="flex h-full w-full max-w-[680px] animate-slide-in flex-col bg-white shadow-drawer"
        onMouseDown={e => e.stopPropagation()}
      >
        {!order ? (
          <div className="flex flex-1 items-center justify-center text-slate-400 text-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
              Loading order…
            </div>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">ORDER</span>
                  <ChevronRight size={12} className="text-slate-300" />
                  <span className="text-xs font-semibold text-slate-600">{order.id}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2.5">
                  <h2 className="text-xl font-bold text-slate-900">{order.id}</h2>
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Created {date(order.createdAt)} · Required by {date(order.requiredDate)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${order.phone}`}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <Phone size={13} /> Call
                </a>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  <Send size={13} /> WhatsApp
                </a>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* ── Value bar ── */}
            <div className="grid shrink-0 grid-cols-3 border-b border-slate-100 bg-slate-50/60 divide-x divide-slate-100">
              <div className="px-6 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Order Value</p>
                <p className="mt-0.5 text-base font-bold text-slate-900">{money(order.value)}</p>
              </div>
              <div className="px-6 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Customer</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900 truncate">{order.customerName}</p>
              </div>
              <div className="px-6 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Vendor</p>
                <p className={`mt-0.5 text-sm font-semibold truncate ${order.assignedVendorName ? 'text-slate-900' : 'text-amber-600'}`}>
                  {order.assignedVendorName || 'Not assigned'}
                </p>
              </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex shrink-0 border-b border-slate-200 px-6">
              {(['details', 'vendor', 'timeline'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`-mb-px border-b-2 px-1 py-3 mr-6 text-sm font-medium capitalize transition-colors ${
                    tab === t
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t === 'vendor' ? 'Vendor Assignment' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* ── Tab content ── */}
            <div className="flex-1 overflow-y-auto">
              {tab === 'details' && <DetailsTab order={order} />}
              {tab === 'vendor' && (
                <VendorTab
                  order={order}
                  vendors={vendors}
                  vendorId={vendorId}
                  setVendorId={setVendorId}
                  busy={busy}
                  onAssign={assign}
                  onStatusChange={changeStatus}
                />
              )}
              {tab === 'timeline' && (
                <div className="p-6">
                  <h3 className="mb-5 text-sm font-semibold text-slate-700">Fulfilment Timeline</h3>
                  <OrderTimeline status={order.status} createdAt={order.createdAt} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Details Tab ── */
function DetailsTab({ order }: { order: Order }) {
  return (
    <div className="p-6 space-y-6">
      {/* Customer info */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Customer Information</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoCell icon={Building2} label="Company"       value={order.customerName} />
          <InfoCell icon={UserRound}  label="Contact Person" value={order.contactPerson} />
          <InfoCell icon={Phone}      label="Phone"         value={order.phone} />
          <InfoCell icon={CalendarDays} label="Required Date" value={date(order.requiredDate)} />
          <div className="sm:col-span-2">
            <InfoCell icon={MapPin} label="Delivery Location" value={order.deliveryLocation} />
          </div>
        </div>
      </section>

      {/* Materials */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Material Requirement</h3>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Material</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">Qty</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">Rate</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map(item => (
                <tr key={item.productId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{item.quantity} {item.unit}</td>
                  <td className="px-4 py-3 text-right text-slate-500 text-xs">{money(item.estimatedRate)}/{item.unit}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">{money(item.quantity * item.estimatedRate)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50">
                <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-slate-600">Estimated Total</td>
                <td className="px-4 py-3 text-right text-base font-bold text-slate-900">{money(order.value)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {order.notes && (
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <MessageSquare size={15} className="mt-0.5 shrink-0 text-amber-600" />
          <div>
            <p className="text-xs font-semibold text-amber-800">Operations Note</p>
            <p className="mt-0.5 text-sm text-amber-700">{order.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Vendor Tab ── */
function VendorTab({
  order, vendors, vendorId, setVendorId, busy, onAssign, onStatusChange,
}: {
  order: Order;
  vendors: Vendor[];
  vendorId: string;
  setVendorId: (id: string) => void;
  busy: boolean;
  onAssign: () => void;
  onStatusChange: (s: OrderStatus) => void;
}) {
  const [areaSearch, setAreaSearch] = useState('');

  // Derive the delivery area from order for smart pre-filtering
  const deliveryArea = order.deliveryLocation.split(',')[0].trim();

  // All unique areas across active vendors
  const allAreas = [...new Set(vendors.flatMap(v => v.serviceAreas))].sort();

  // Filter vendors by area search
  const filteredVendors = areaSearch
    ? vendors.filter(v =>
        v.serviceAreas.some(a => a.toLowerCase().includes(areaSearch.toLowerCase()))
      )
    : vendors;

  const displayVendors = filteredVendors.slice(0, 6);

  return (
    <div className="p-6 space-y-6">
      {/* Current assignment */}
      {order.assignedVendorName && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-emerald-900">Assigned: {order.assignedVendorName}</p>
            <p className="text-xs text-emerald-700">You can reassign by selecting a different vendor below.</p>
          </div>
        </div>
      )}

      {/* Area search */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Find Vendors by Area</h3>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <MapPin size={11} />
            Delivery: <span className="font-medium text-slate-600">{deliveryArea}</span>
          </span>
        </div>

        {/* Area search input */}
        <div className="relative mb-3">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={areaSearch}
            onChange={e => setAreaSearch(e.target.value)}
            placeholder="Search by area — Gachibowli, Secunderabad…"
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {areaSearch && (
            <button
              onClick={() => setAreaSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Quick area chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {['Gachibowli', 'Secunderabad', 'Kondapur', 'Financial District', 'Madhapur', 'Manikonda'].map(area => {
            const count = vendors.filter(v =>
              v.serviceAreas.some(a => a.toLowerCase() === area.toLowerCase())
            ).length;
            return (
              <button
                key={area}
                onClick={() => setAreaSearch(areaSearch === area ? '' : area)}
                className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-all ${
                  areaSearch === area
                    ? 'border-blue-500 bg-blue-600 text-white'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                {area}
                <span className={`rounded-full px-1 text-[10px] font-bold ${
                  areaSearch === area ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Result count */}
        {areaSearch && (
          <p className="mb-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">{filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''}</span>{' '}
            service <span className="font-semibold text-blue-600">"{areaSearch}"</span>
          </p>
        )}
      </section>

      {/* Vendor cards */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          {areaSearch ? `Vendors covering ${areaSearch}` : 'All Vendors'}
        </h3>
        <div className="space-y-2">
          {displayVendors.map(v => (
            <button
              key={v.id}
              onClick={() => setVendorId(v.id)}
              className={`w-full rounded-xl border p-4 text-left transition-all ${
                vendorId === v.id
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${vendorId === v.id ? 'bg-blue-100' : 'bg-slate-100'}`}>
                    <span className="text-sm font-bold text-slate-600">{v.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{v.name}</p>
                    <p className="text-xs text-slate-500">{v.city}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {v.serviceAreas.map(a => (
                        <span
                          key={a}
                          className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-colors ${
                            areaSearch && a.toLowerCase().includes(areaSearch.toLowerCase())
                              ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <MapPin size={9} className="inline mr-0.5" />{a}
                        </span>
                      ))}
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {v.categories.slice(0, 3).map(c => (
                        <span key={c} className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                    <Star size={11} fill="currentColor" />
                    {v.rating}
                  </div>
                  {vendorId === v.id && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                      <Check size={10} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
        <button
          disabled={!vendorId || busy}
          onClick={onAssign}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
        >
          {busy ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Check size={15} strokeWidth={2.5} />
          )}
          Confirm Vendor Assignment
        </button>
      </section>

      {/* Status update */}
      <section>
        <h3 className="mb-1 text-sm font-semibold text-slate-700">Update Fulfilment Status</h3>
        <p className="mb-3 text-xs text-slate-400">Current: <span className="font-medium text-slate-600">{STATUS_LABELS[order.status]}</span></p>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              disabled={busy}
              onClick={() => onStatusChange(s)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                order.status === s
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── Helpers ── */
function InfoCell({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={12} className="text-slate-400" />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      </div>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
