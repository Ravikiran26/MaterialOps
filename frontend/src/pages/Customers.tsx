import { useEffect, useState } from 'react';
import { Building2, Mail, Phone } from 'lucide-react';
import { api } from '../lib/api';
import { money } from '../lib/format';
import PageHeader from '../components/PageHeader';
import type { Customer } from '../types';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  useEffect(() => { api.customers().then(setCustomers); }, []);

  const totalValue = customers.reduce((s, c) => s + c.totalValue, 0);
  const totalOrders = customers.reduce((s, c) => s + c.totalOrders, 0);

  return (
    <>
      <PageHeader
        eyebrow="Customer Management"
        title="B2B Customers"
        subtitle="Contractors, builders and project procurement teams ordering via the customer app."
      />

      {/* Summary stats */}
      <div className="mt-5 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-xs">
          <p className="text-2xl font-bold text-slate-900">{customers.length}</p>
          <p className="mt-0.5 text-sm font-medium text-slate-600">Total Customers</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-xs">
          <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
          <p className="mt-0.5 text-sm font-medium text-slate-600">Total Orders</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-xs">
          <p className="text-2xl font-bold text-emerald-600">{money(totalValue)}</p>
          <p className="mt-0.5 text-sm font-medium text-slate-600">Lifetime Value</p>
        </div>
      </div>

      {/* Table */}
      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Company</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Contact</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Location</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">GST</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Orders</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Business</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customers.map(c => (
                <tr key={c.id} className="group cursor-pointer transition-colors hover:bg-slate-50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{c.companyName}</p>
                        <p className="text-xs text-slate-400">{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-700">{c.contactPerson}</p>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                      <Phone size={11} />{c.phone}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                      <Mail size={11} />{c.email}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">{c.city}</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">{c.gst}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="font-semibold text-slate-900">{c.totalOrders}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="font-semibold text-emerald-700">{money(c.totalValue)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
