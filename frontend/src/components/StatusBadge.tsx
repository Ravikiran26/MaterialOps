import type { OrderStatus } from '../types';
import { statusLabel } from '../lib/format';

const config: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  NEW:             { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500' },
  CONFIRMED:       { bg: 'bg-violet-50',  text: 'text-violet-700',  dot: 'bg-violet-500' },
  VENDOR_ASSIGNED: { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  PROCESSING:      { bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500' },
  DISPATCHED:      { bg: 'bg-cyan-50',    text: 'text-cyan-700',    dot: 'bg-cyan-500' },
  DELIVERED:       { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  CANCELLED:       { bg: 'bg-slate-100',  text: 'text-slate-500',   dot: 'bg-slate-400' },
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const { bg, text, dot } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${bg} ${text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {statusLabel(status)}
    </span>
  );
}
