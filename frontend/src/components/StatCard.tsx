import type { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  note: string;
  icon: LucideIcon;
  accent?: 'blue' | 'emerald' | 'amber' | 'violet' | 'slate';
}

const accentMap = {
  blue:    { iconBg: 'bg-blue-50',    iconText: 'text-blue-600' },
  emerald: { iconBg: 'bg-emerald-50', iconText: 'text-emerald-600' },
  amber:   { iconBg: 'bg-amber-50',   iconText: 'text-amber-600' },
  violet:  { iconBg: 'bg-violet-50',  iconText: 'text-violet-600' },
  slate:   { iconBg: 'bg-slate-100',  iconText: 'text-slate-600' },
};

export default function StatCard({ title, value, note, icon: Icon, accent = 'slate' }: Props) {
  const { iconBg, iconText } = accentMap[accent];
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon size={18} className={iconText} />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        <p className="mt-0.5 text-sm font-medium text-slate-600">{title}</p>
        <p className="mt-1 text-xs text-slate-400">{note}</p>
      </div>
    </div>
  );
}
