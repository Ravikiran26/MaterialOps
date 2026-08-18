import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Bell, Boxes, ChevronDown, ClipboardList, LayoutDashboard,
  MapPin, Menu, PackageSearch, Search, Truck, UsersRound, X,
} from 'lucide-react';

const nav = [
  { to: '/',          label: 'Overview',   icon: LayoutDashboard },
  { to: '/orders',    label: 'Orders',     icon: ClipboardList },
  { to: '/vendors',   label: 'Vendors',    icon: Truck },
  { to: '/customers', label: 'Customers',  icon: UsersRound },
  { to: '/products',  label: 'Products',   icon: Boxes },
  { to: '/reports',   label: 'Reports',    icon: PackageSearch },
];

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <>
      {/* Logo */}
      <div className="flex h-14 items-center gap-3 border-b border-slate-800/60 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <span className="text-sm font-bold text-white">M</span>
        </div>
        <div>
          <p className="text-[13px] font-semibold leading-none text-white">MaterialOps</p>
          <p className="mt-0.5 text-[11px] leading-none text-slate-400">B2B Operations</p>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onNavClick}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`
              }
            >
              <Icon size={15} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Operations section */}
        <div className="mt-6">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Operations
          </p>
          <div className="space-y-0.5">
            <NavLink
              to="/orders"
              onClick={onNavClick}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-500/10 text-[10px] font-bold text-amber-400">!</span>
              Order Queue
            </NavLink>
            <NavLink
              to="/vendors"
              onClick={onNavClick}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-800 text-[10px] font-bold text-slate-400">V</span>
              Vendor Assignment
            </NavLink>
          </div>
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-slate-800/60 p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-slate-800">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            OA
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-slate-200">Operations Admin</p>
            <p className="truncate text-[11px] text-slate-500">Hyderabad Region</p>
          </div>
          <ChevronDown size={13} className="shrink-0 text-slate-600" />
        </button>
      </div>
    </>
  );
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ── Desktop Sidebar ── */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[240px] flex-col bg-slate-950 lg:flex">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />

          {/* Drawer */}
          <aside
            className="absolute inset-y-0 left-0 flex w-[240px] flex-col bg-slate-950"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute right-3 top-3.5 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <X size={16} />
            </button>
            <SidebarContent onNavClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col lg:pl-[240px]">
        {/* Top header */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm lg:px-8">
          <div className="flex flex-1 items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={17} />
            </button>

            <div className="relative w-full max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Search orders, customers…"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 sm:flex">
              <MapPin size={11} className="text-slate-400" />
              Hyderabad
            </div>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50">
              <Bell size={15} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white transition-opacity hover:opacity-90">
              OA
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
