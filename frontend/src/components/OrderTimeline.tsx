import { Check, XCircle } from 'lucide-react';
import type { OrderStatus } from '../types';

const STAGES = [
  { key: 'CREATED',        label: 'Order Created',    desc: 'Customer requirement received' },
  { key: 'NEW',            label: 'Under Review',     desc: 'Operations team reviewing' },
  { key: 'CONFIRMED',      label: 'Confirmed',        desc: 'Order confirmed with customer' },
  { key: 'VENDOR_ASSIGNED',label: 'Vendor Assigned',  desc: 'Vendor selected & notified' },
  { key: 'PROCESSING',     label: 'Processing',       desc: 'Vendor preparing materials' },
  { key: 'DISPATCHED',     label: 'Dispatched',       desc: 'Materials en route to site' },
  { key: 'DELIVERED',      label: 'Delivered',        desc: 'Order complete' },
];

const STATUS_IDX: Record<OrderStatus, number> = {
  NEW: 1, CONFIRMED: 2, VENDOR_ASSIGNED: 3, PROCESSING: 4, DISPATCHED: 5, DELIVERED: 6, CANCELLED: -1,
};

export default function OrderTimeline({ status, createdAt }: { status: OrderStatus; createdAt: string }) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        <XCircle size={16} />
        This order has been cancelled.
      </div>
    );
  }

  const currentIdx = STATUS_IDX[status] ?? 1;
  const allDone = status === 'DELIVERED';

  return (
    <div className="space-y-0">
      {STAGES.map((stage, i) => {
        const done = allDone ? true : i < currentIdx;
        const current = !allDone && i === currentIdx;
        const isLast = i === STAGES.length - 1;

        return (
          <div key={stage.key} className="flex gap-3.5">
            <div className="flex flex-col items-center">
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                done    ? 'border-emerald-500 bg-emerald-500'
                : current ? 'border-blue-600 bg-blue-600'
                : 'border-slate-200 bg-white'
              }`}>
                {done
                  ? <Check size={10} className="text-white" strokeWidth={3} />
                  : current
                  ? <div className="h-2 w-2 rounded-full bg-white" />
                  : <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                }
              </div>
              {!isLast && (
                <div className={`my-0.5 w-0.5 flex-1 min-h-[20px] rounded-full transition-colors ${done ? 'bg-emerald-300' : 'bg-slate-100'}`} />
              )}
            </div>
            <div className={`pb-4 min-w-0 ${isLast ? 'pb-0' : ''}`}>
              <div className="flex items-center gap-2">
                <p className={`text-sm font-medium ${done || current ? 'text-slate-900' : 'text-slate-400'}`}>
                  {stage.label}
                </p>
                {current && (
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                    Current
                  </span>
                )}
                {done && !allDone && (
                  <span className="text-[11px] text-slate-400">Done</span>
                )}
              </div>
              <p className={`text-xs ${done || current ? 'text-slate-500' : 'text-slate-300'}`}>
                {stage.desc}
                {i === 0 && (
                  <> · {new Date(createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
