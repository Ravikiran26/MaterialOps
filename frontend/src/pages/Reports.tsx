import { useEffect, useState } from 'react';
import { IndianRupee, PackageCheck, TrendingUp, Truck } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../lib/api';
import { money, shortMoney, statusLabel } from '../lib/format';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';

const BAR_COLORS = ['#2563eb', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626'];

export default function Reports() {
  const [d, setD] = useState<any>();
  useEffect(() => { api.reports().then(setD); }, []);

  if (!d) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
        <p className="text-sm text-slate-400">Loading reports…</p>
      </div>
    </div>
  );

  const deliveryRate = d.totalOrderValue > 0
    ? Math.round((d.deliveredValue / d.totalOrderValue) * 100)
    : 0;

  return (
    <>
      <PageHeader
        eyebrow="Operations Reporting"
        title="Reports"
        subtitle="Operational summary — fulfilment performance and vendor analytics."
        action={
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50">
            Export CSV
          </button>
        }
      />

      {/* KPI row */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Order Value"
          value={shortMoney(d.totalOrderValue)}
          note={money(d.totalOrderValue)}
          icon={IndianRupee}
          accent="blue"
        />
        <StatCard
          title="Delivered Value"
          value={shortMoney(d.deliveredValue)}
          note="Completed fulfilments"
          icon={PackageCheck}
          accent="emerald"
        />
        <StatCard
          title="Fulfilment Rate"
          value={`${deliveryRate}%`}
          note="Delivered vs total value"
          icon={TrendingUp}
          accent="violet"
        />
        <StatCard
          title="Vendors Used"
          value={d.byVendor.length}
          note="Suppliers with active orders"
          icon={Truck}
          accent="amber"
        />
      </div>

      {/* Two-col: table + chart */}
      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_320px]">
        {/* Vendor performance table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Vendor Performance</h3>
            <p className="mt-0.5 text-xs text-slate-400">Fulfilment stats per assigned vendor</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Vendor</th>
                  <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">Orders</th>
                  <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">Delivered</th>
                  <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">Rate</th>
                  <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {d.byVendor.map((x: any, i: number) => {
                  const rate = x.orders > 0 ? Math.round((x.delivered / x.orders) * 100) : 0;
                  return (
                    <tr key={x.vendorId} className="transition-colors hover:bg-slate-50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ background: BAR_COLORS[i % BAR_COLORS.length] }}
                          />
                          <span className="font-medium text-slate-900">{x.vendorName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center text-slate-700">{x.orders}</td>
                      <td className="px-5 py-3.5 text-center text-slate-700">{x.delivered}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`font-semibold ${rate >= 80 ? 'text-emerald-600' : rate >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                          {rate}%
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-slate-900">{money(x.value)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bar chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900">Orders by Vendor</h3>
          <p className="mt-0.5 text-xs text-slate-400">Number of orders assigned</p>
          <div className="mt-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.byVendor} layout="vertical" margin={{ left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" allowDecimals={false} fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis
                  type="category"
                  dataKey="vendorName"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                  width={96}
                  tick={{ fill: '#64748b' }}
                  tickFormatter={(v: string) => v.split(' ').slice(0, 2).join(' ')}
                />
                <Tooltip
                  formatter={(v: any, name: string) => [v, name === 'orders' ? 'Orders' : 'Delivered']}
                  contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="orders" radius={[0, 4, 4, 0]} maxBarSize={16}>
                  {d.byVendor.map((_: any, i: number) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Status breakdown */}
      {d.statusCounts && (
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Orders by Status</h3>
          </div>
          <div className="grid divide-y divide-slate-50 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {d.statusCounts?.map((x: any) => (
              <div key={x.status} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm font-medium text-slate-700">{statusLabel(x.status)}</span>
                <span className="text-sm font-bold text-slate-900">{x.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
