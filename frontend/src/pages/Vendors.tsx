import { useEffect, useRef, useState } from 'react';
import {
  Building2, Check, CheckCircle2, MapPin, Phone, Plus,
  Search, Star, Tag, Truck, X,
} from 'lucide-react';
import { api } from '../lib/api';
import PageHeader from '../components/PageHeader';
import type { Vendor } from '../types';

const DEMO_AREAS = ['Gachibowli', 'Secunderabad', 'Kondapur', 'Financial District', 'Madhapur', 'Manikonda', 'Hitech City', 'Kukatpally'];

const ALL_CATEGORIES = ['Cement', 'Steel', 'Sand', 'Aggregates', 'Bricks', 'Blocks', 'Electrical', 'Plumbing', 'Hardware', 'Tiles', 'Paint', 'Glass'];

const CITIES = ['Hyderabad', 'Secunderabad', 'Cyberabad', 'Rangareddy'];

interface NewVendorForm {
  name: string;
  contactPerson: string;
  phone: string;
  gst: string;
  city: string;
  serviceAreas: string[];
  categories: string[];
  active: boolean;
}

const EMPTY_FORM: NewVendorForm = {
  name: '', contactPerson: '', phone: '', gst: '',
  city: 'Hyderabad', serviceAreas: [], categories: [], active: true,
};

/* ─────────────────────────────────────────── */
/*  Add Vendor Drawer                          */
/* ─────────────────────────────────────────── */
function AddVendorDrawer({
  open, onClose, onSave,
}: { open: boolean; onClose: () => void; onSave: (v: Vendor) => void }) {
  const [form, setForm] = useState<NewVendorForm>(EMPTY_FORM);
  const [areaInput, setAreaInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof NewVendorForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const areaRef = useRef<HTMLInputElement>(null);

  // Reset when drawer opens
  useEffect(() => {
    if (open) { setForm(EMPTY_FORM); setErrors({}); setSubmitted(false); setAreaInput(''); }
  }, [open]);

  if (!open) return null;

  function set<K extends keyof NewVendorForm>(key: K, value: NewVendorForm[K]) {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  function addArea(raw: string) {
    const area = raw.trim().replace(/,$/, '').trim();
    if (area && !form.serviceAreas.includes(area)) {
      set('serviceAreas', [...form.serviceAreas, area]);
    }
    setAreaInput('');
  }

  function removeArea(area: string) {
    set('serviceAreas', form.serviceAreas.filter(a => a !== area));
  }

  function toggleCategory(cat: string) {
    set('categories', form.categories.includes(cat)
      ? form.categories.filter(c => c !== cat)
      : [...form.categories, cat]);
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.name.trim())          e.name          = 'Business name is required';
    if (!form.contactPerson.trim()) e.contactPerson = 'Contact person is required';
    if (!form.phone.trim())         e.phone         = 'Phone number is required';
    if (!form.city.trim())          e.city          = 'City is required';
    if (form.serviceAreas.length === 0) e.serviceAreas = 'Add at least one service area';
    if (form.categories.length === 0)   e.categories   = 'Select at least one category';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const newVendor: Vendor = {
      id: `VND-${String(Math.floor(Math.random() * 900) + 100)}`,
      name: form.name.trim(),
      contactPerson: form.contactPerson.trim(),
      phone: form.phone.trim(),
      gst: form.gst.trim() || 'Pending verification',
      city: form.city,
      serviceAreas: form.serviceAreas,
      categories: form.categories,
      rating: 0,
      active: form.active,
    };
    onSave(newVendor);
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in" onMouseDown={onClose}>
      <div className="flex-1 bg-slate-950/40 backdrop-blur-[2px]" />
      <div
        className="flex h-full w-full max-w-[560px] animate-slide-in flex-col bg-white shadow-drawer"
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Onboard New Vendor</h2>
            <p className="mt-0.5 text-xs text-slate-400">Add a supplier to the approved vendor network</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Success state */}
        {submitted ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 size={32} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Vendor Onboarded!</h3>
              <p className="mt-1 text-sm text-slate-500">
                <strong className="text-slate-700">{form.name}</strong> has been added to the vendor network.
              </p>
            </div>
            <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm">
              <div className="grid gap-2">
                <Row label="Contact" value={`${form.contactPerson} · ${form.phone}`} />
                <Row label="City" value={form.city} />
                <Row label="Areas" value={form.serviceAreas.join(', ')} />
                <Row label="Categories" value={form.categories.join(', ')} />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setForm(EMPTY_FORM); setSubmitted(false); setAreaInput(''); }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Add Another
              </button>
              <button
                onClick={onClose}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 p-6">

                {/* Business Details */}
                <section>
                  <SectionHeading icon={Building2} label="Business Details" />
                  <div className="mt-3 space-y-3">
                    <Field label="Business / Shop Name" required error={errors.name}>
                      <input
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                        placeholder="e.g. Sri Balaji Building Materials"
                        className={inputCls(!!errors.name)}
                      />
                    </Field>
                    <Field label="GST Number" error={errors.gst}>
                      <input
                        value={form.gst}
                        onChange={e => set('gst', e.target.value.toUpperCase())}
                        placeholder="e.g. 36ABCDE1234F1Z5"
                        className={inputCls(false)}
                        maxLength={15}
                      />
                    </Field>
                    <Field label="City" required error={errors.city}>
                      <select
                        value={form.city}
                        onChange={e => set('city', e.target.value)}
                        className={inputCls(!!errors.city)}
                      >
                        {CITIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                </section>

                {/* Contact Details */}
                <section>
                  <SectionHeading icon={Phone} label="Contact Details" />
                  <div className="mt-3 space-y-3">
                    <Field label="Contact Person" required error={errors.contactPerson}>
                      <input
                        value={form.contactPerson}
                        onChange={e => set('contactPerson', e.target.value)}
                        placeholder="e.g. Suresh Reddy"
                        className={inputCls(!!errors.contactPerson)}
                      />
                    </Field>
                    <Field label="Phone Number" required error={errors.phone}>
                      <input
                        value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                        placeholder="+91 98490 XXXXX"
                        type="tel"
                        className={inputCls(!!errors.phone)}
                      />
                    </Field>
                  </div>
                </section>

                {/* Service Areas */}
                <section>
                  <SectionHeading icon={MapPin} label="Service Areas" />
                  <p className="mt-0.5 text-xs text-slate-400">Areas where this vendor can deliver materials</p>
                  <div className="mt-3">
                    <div className={`rounded-xl border p-3 transition-colors ${errors.serviceAreas ? 'border-red-300 bg-red-50/40' : 'border-slate-200 bg-white'}`}>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {form.serviceAreas.map(area => (
                          <span key={area} className="flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            {area}
                            <button type="button" onClick={() => removeArea(area)} className="text-blue-500 hover:text-blue-800">
                              <X size={11} />
                            </button>
                          </span>
                        ))}
                      </div>
                      {/* Input */}
                      <input
                        ref={areaRef}
                        value={areaInput}
                        onChange={e => setAreaInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') { e.preventDefault(); addArea(areaInput); }
                          if (e.key === ',') { e.preventDefault(); addArea(areaInput); }
                        }}
                        onBlur={() => { if (areaInput.trim()) addArea(areaInput); }}
                        placeholder={form.serviceAreas.length ? 'Add another area…' : 'Type area name and press Enter — e.g. Gachibowli'}
                        className="w-full text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                      />
                    </div>
                    {errors.serviceAreas && <p className="mt-1 text-xs text-red-600">{errors.serviceAreas}</p>}
                    {/* Suggestion chips */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="text-[11px] text-slate-400">Suggest:</span>
                      {DEMO_AREAS.filter(a => !form.serviceAreas.includes(a)).map(area => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => set('serviceAreas', [...form.serviceAreas, area])}
                          className="rounded-full border border-dashed border-slate-300 px-2 py-0.5 text-[11px] text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                        >
                          + {area}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Material Categories */}
                <section>
                  <SectionHeading icon={Tag} label="Material Categories" />
                  <p className="mt-0.5 text-xs text-slate-400">What materials does this vendor supply?</p>
                  {errors.categories && <p className="mt-1 text-xs text-red-600">{errors.categories}</p>}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {ALL_CATEGORIES.map(cat => {
                      const checked = form.categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                            checked
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            checked ? 'border-blue-500 bg-blue-600' : 'border-slate-300 bg-white'
                          }`}>
                            {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                          </span>
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Status */}
                <section>
                  <SectionHeading icon={CheckCircle2} label="Onboarding Status" />
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {form.active ? 'Active — available for assignment' : 'Inactive — not yet available'}
                      </p>
                      <p className="text-xs text-slate-400">Toggle to set initial availability</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => set('active', !form.active)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${form.active ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.active ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </section>

              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 flex items-center justify-between border-t border-slate-200 bg-slate-50/60 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <Plus size={15} />
                Onboard Vendor
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── */
/*  Vendors Page                               */
/* ─────────────────────────────────────────── */
export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [areaSearch, setAreaSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  useEffect(() => { api.vendors().then(setVendors); }, []);

  const activeVendors = vendors.filter(v => v.active);
  const inactive = vendors.filter(v => !v.active).length;
  const allAreas = [...new Set(vendors.flatMap(v => v.serviceAreas))].sort();

  const filtered = areaSearch.trim()
    ? activeVendors.filter(v =>
        v.serviceAreas.some(a => a.toLowerCase().includes(areaSearch.toLowerCase())) ||
        v.city.toLowerCase().includes(areaSearch.toLowerCase())
      )
    : activeVendors;

  function handleSave(v: Vendor) {
    setVendors(prev => [v, ...prev]);
  }

  return (
    <>
      <PageHeader
        eyebrow="Vendor Management"
        title="Vendors"
        subtitle="Approved suppliers for B2B construction material fulfilment."
        action={
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Plus size={15} />
            Add Vendor
          </button>
        }
      />

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-xs">
          <p className="text-2xl font-bold text-slate-900">{vendors.length}</p>
          <p className="mt-0.5 text-sm font-medium text-slate-600">Total Vendors</p>
          <p className="mt-0.5 text-xs text-slate-400">{allAreas.length} service areas</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-xs">
          <p className="text-2xl font-bold text-emerald-600">{activeVendors.length}</p>
          <p className="mt-0.5 text-sm font-medium text-slate-600">Active</p>
          <p className="mt-0.5 text-xs text-slate-400">Available for assignment</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-xs">
          <p className="text-2xl font-bold text-slate-400">{inactive}</p>
          <p className="mt-0.5 text-sm font-medium text-slate-600">Inactive</p>
          <p className="mt-0.5 text-xs text-slate-400">Temporarily unavailable</p>
        </div>
      </div>

      {/* Area Search */}
      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <MapPin size={13} />
            Search by Delivery Area
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={areaSearch}
              onChange={e => setAreaSearch(e.target.value)}
              placeholder="e.g. Gachibowli, Secunderabad, Kondapur…"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            {areaSearch && (
              <button onClick={() => setAreaSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>
          {areaSearch && (
            <span className="text-sm font-semibold text-slate-700">
              {filtered.length} vendor{filtered.length !== 1 ? 's' : ''} cover{filtered.length === 1 ? 's' : ''}{' '}
              <span className="text-blue-600">"{areaSearch}"</span>
            </span>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs font-medium text-slate-400">Quick search:</span>
          {DEMO_AREAS.map(area => {
            const count = activeVendors.filter(v => v.serviceAreas.some(a => a.toLowerCase() === area.toLowerCase())).length;
            return (
              <button
                key={area}
                onClick={() => setAreaSearch(areaSearch === area ? '' : area)}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
                  areaSearch === area ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700'
                }`}
              >
                {area}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${areaSearch === area ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vendor Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        {areaSearch && (
          <div className="border-b border-slate-100 bg-blue-50/60 px-5 py-3">
            <p className="text-sm text-blue-700">
              Showing <strong>{filtered.length} vendor{filtered.length !== 1 ? 's' : ''}</strong> that service <strong>{areaSearch}</strong>
              {filtered.length === 0 && ' — try a different area name'}
            </p>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Vendor</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Contact</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Service Areas</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Categories</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Rating</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(areaSearch ? filtered : vendors).map(v => (
                <tr key={v.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <Truck size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900">{v.name}</p>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${v.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${v.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {v.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{v.id} · {v.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-700">{v.contactPerson}</p>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                      <Phone size={11} />{v.phone}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {v.serviceAreas.map(a => (
                        <span key={a} className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
                          areaSearch && a.toLowerCase().includes(areaSearch.toLowerCase())
                            ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}>{a}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {v.categories.map(c => (
                        <span key={c} className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {v.rating > 0 ? (
                      <div className="flex items-center gap-1 font-semibold text-amber-600">
                        <Star size={12} fill="currentColor" />{v.rating}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">New</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <a href={`tel:${v.phone}`} className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50">
                        <Phone size={11} /> Call
                      </a>
                      <button className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100">
                        Assign
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {areaSearch && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <MapPin size={24} className="text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No vendors found for "{areaSearch}"</p>
            <p className="text-xs text-slate-400">Try nearby areas like Kondapur, Madhapur or Hitech City</p>
          </div>
        )}
      </div>

      <AddVendorDrawer open={showAdd} onClose={() => setShowAdd(false)} onSave={handleSave} />
    </>
  );
}

/* ── Small helpers ── */
function SectionHeading({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-slate-400" />
      <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
    </div>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-medium text-slate-700">{value}</span>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `h-9 w-full rounded-lg border px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
    hasError
      ? 'border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
      : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
  }`;
}
