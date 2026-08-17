import { useEffect, useState } from 'react';
import { Boxes, Package } from 'lucide-react';
import { api } from '../lib/api';
import { money } from '../lib/format';
import PageHeader from '../components/PageHeader';
import type { Product } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  Cement:    'bg-slate-100 text-slate-700',
  Steel:     'bg-blue-50 text-blue-700',
  Sand:      'bg-amber-50 text-amber-700',
  Bricks:    'bg-orange-50 text-orange-700',
  Aggregate: 'bg-stone-100 text-stone-700',
  Electrical:'bg-yellow-50 text-yellow-700',
  Plumbing:  'bg-cyan-50 text-cyan-700',
  Tiles:     'bg-violet-50 text-violet-700',
  Paint:     'bg-pink-50 text-pink-700',
};

function categoryColor(cat: string) {
  for (const key of Object.keys(CATEGORY_COLORS)) {
    if (cat.toLowerCase().includes(key.toLowerCase())) return CATEGORY_COLORS[key];
  }
  return 'bg-slate-100 text-slate-600';
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  useEffect(() => { api.products().then(setProducts); }, []);

  const categories = [...new Set(products.map(p => p.category))];
  const filtered = search
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <>
      <PageHeader
        eyebrow="Product Catalogue"
        title="Construction Materials"
        subtitle="Material catalogue referenced by B2B customers when placing requirements."
        action={
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">{products.length} products · {categories.length} categories</span>
          </div>
        }
      />

      {/* Category pills */}
      <div className="mt-5 flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSearch(search === cat ? '' : cat)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
              search === cat
                ? 'border-blue-500 bg-blue-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
        {search && (
          <button
            onClick={() => setSearch('')}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-50"
          >
            Clear ×
          </button>
        )}
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Product</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Category</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Unit</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Indicative Price</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">Active Vendors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => (
                <tr key={p.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <Package size={14} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${categoryColor(p.category)}`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{p.unit}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-slate-900">{money(p.indicativePrice)}</td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Boxes size={13} className="text-slate-400" />
                      <span className="font-semibold text-slate-700">{p.activeVendors}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-400">No products match "{search}"</div>
        )}
      </div>
    </>
  );
}
