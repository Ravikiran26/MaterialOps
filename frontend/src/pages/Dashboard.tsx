import { useEffect, useState } from 'react';
import { ArrowRight, ClipboardList, IndianRupee, PackageCheck, Truck, UserCheck, UsersRound } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../lib/api';
import { date, money, shortMoney, statusLabel } from '../lib/format';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PageHeader from '../components/PageHeader';
import OrderDrawer from '../components/OrderDrawer';
import type { Order } from '../types';

const PIPELINE_STAGES = ['NEW', 'CONFIRMED', 'VENDOR_ASSIGNED', 'PROCESSING', 'DISPATCHED', 'DELIVERED'];
const STAGE_COLORS: Record<string, string> = {
  NEW: 'bg-blue-500', CONFIRMED: 'bg-violet-500', VENDOR_ASSIGNED: 'bg-amber-500',
  PROCESSING: 'bg-orange-500', DISPATCHED: 'bg-cyan-500', DELIVERED: 'bg-emerald-500',
};
const STAGE_TEXT: Record<string, string> = {
  NEW: 'text-blue-600', CONFIRMED: 'text-violet-600', VENDOR_ASSIGNED: 'text-amber-600',
  PROCESSING: 'text-orange-600', DISPATCHED: 'text-cyan-600', DELIVERED: 'text-emerald-600',
};

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [selected, setSelected] = useState<string>();
  const load = () => api.dashboard().then(setData);
  useEffect(() => { load(); }, []);

  if (!data) return <Loading />;

  const statusMap = Object.fromEntries((data.statusCounts as { status: string; count: number }[]).map(x => [x.status, x.count]));
  const unassigned = (data.recentOrders as Order[]).filter(o => !o.assignedVendorId && o.status !== 'CANCELLED');

  return (
    <>
      <PageHeader
        eyebrow="Operations Overview"
        title="Operations Dashboard"
        subtitle="Track incoming requirements, vendor assignments and fulfilment."
        action={
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
              17 Aug 2026 · Hyderabad
            </span>
            <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
              View Order Queue <ArrowRight size={14} />
            </button>
          </div>
        }
      />

      {/* ── KPI Cards ── */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="New Orders"
          value={data.stats.newOrders}
          note="Require review"
          icon={ClipboardList}
          accent="blue"
        />
        <StatCard
          title="Awaiting Assignment"
          value={statusMap['NEW'] ?? 0}
          note="No vendor selected"
          icon={UserCheck}
          accent="amber"
        />
        <StatCard
          title="Active Fulfilments"
          value={data.stats.activeFulfilments}
          note="Assigned to dispatched"
          icon={Truck}
          accent="violet"
        />
        <StatCard
          title="Delivered"
          value={data.stats.delivered}
          note="Completed orders"
          icon={PackageCheck}
          accent="emerald"
        />
        <StatCard
          title="Order Value"
          value={shortMoney(data.stats.totalValue)}
          note={`${data.stats.activeVendors} active vendors`}
          icon={IndianRupee}
          accent="slate"
        />
      </div>

      {/* ── Pipeline ── */}
      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Order Pipeline</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {PIPELINE_STAGES.map(stage => {
            const count = statusMap[stage] ?? 0;
            return (
              <div key={stage} className="flex flex-col items-center gap-1.5">
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`absolute left-0 top-0 h-full ${STAGE_COLORS[stage]} rounded-full transition-all`}
                    style={{ width: `${Math.min(100, (count / (data.stats.totalOrders || 1)) * 100 * 2)}%` }}
                  />
                </div>
                <span className={`text-xl font-bold ${STAGE_TEXT[stage]}`}>{count}</span>
                <span className="text-center text-[10px] font-medium text-slate-500 leading-tight">{statusLabel(stage)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Two-col: Attention + Quick Actions ── */}
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_280px]">
        {/* Orders requiring attention */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Orders Requiring Attention</h3>
              <p className="mt-0.5 text-xs text-slate-400">{unassigned.length} orders need a vendor assigned</p>
            </div>
            {unassigned.length > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                {unassigned.length}
              </span>
            )}
          </div>
          {unassigned.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">All orders have vendors assigned.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {unassigned.slice(0, 5).map(o => (
                <div
                  key={o.id}
                  onClick={() => setSelected(o.id)}
                  className="flex cursor-pointer items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-blue-600">{o.id}</span>
                      <StatusBadge status={o.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-slate-600">{o.customerName} · {o.deliveryLocation}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-slate-900">{money(o.value)}</p>
                    <p className="text-xs text-slate-400">{date(o.requiredDate)}</p>
                  </div>
                  <button className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700">
                    Assign
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { label: 'View Pending Orders',  desc: 'Orders awaiting vendor',   color: 'bg-amber-500' },
              { label: 'B2B Customers',        desc: `${data.stats.customers} active accounts`, color: 'bg-violet-500' },
              { label: 'Active Vendors',       desc: `${data.stats.activeVendors} suppliers`,   color: 'bg-emerald-500' },
              { label: 'Fulfilment Report',    desc: 'View ops summary',          color: 'bg-blue-500' },
            ].map(item => (
              <div
                key={item.label}
                className="flex cursor-pointer items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
              >
                <div className={`h-2 w-2 shrink-0 rounded-full ${item.color}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
                <ArrowRight size={13} className="ml-auto shrink-0 text-slate-300" />
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
            <div className="flex items-center gap-3">
              <UsersRound size={16} className="text-slate-400" />
              <div>
                <p className="text-xs font-semibold text-slate-700">{data.stats.customers} B2B Customers</p>
                <p className="text-[11px] text-slate-400">{data.stats.activeVendors} active vendors</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chart + Recent Orders ── */}
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_320px]">
        {/* Recent orders table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Recent Orders</h3>
              <p className="mt-0.5 text-xs text-slate-400">Latest B2B material requirements</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Order</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Customer</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Value</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Vendor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(data.recentOrders as Order[]).map(o => (
                  <tr
                    key={o.id}
                    onClick={() => setSelected(o.id)}
                    className="cursor-pointer transition-colors hover:bg-slate-50"
                  >
                    <td className="px-5 py-3.5 font-semibold text-blue-600">{o.id}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-900">{o.customerName}</p>
                      <p className="text-xs text-slate-400">{o.deliveryLocation}</p>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{money(o.value)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-3.5 text-sm">
                      {o.assignedVendorName
                        ? <span className="text-slate-700">{o.assignedVendorName}</span>
                        : <span className="font-medium text-amber-600">Unassigned</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bar chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900">Status Distribution</h3>
          <p className="mt-0.5 text-xs text-slate-400">Orders by fulfilment stage</p>
          <div className="mt-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.statusCounts} layout="vertical" margin={{ left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" allowDecimals={false} fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis
                  type="category"
                  dataKey="status"
                  tickFormatter={statusLabel}
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                  width={72}
                  tick={{ fill: '#64748b' }}
                />
                <Tooltip
                  formatter={(v: any) => [v, 'Orders']}
                  labelFormatter={statusLabel}
                  contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <OrderDrawer orderId={selected} onClose={() => setSelected(undefined)} onChanged={load} />
    </>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
        <p className="text-sm text-slate-400">Loading dashboard…</p>
      </div>
    </div>
  );
}
