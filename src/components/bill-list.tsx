'use client';

import { useFinanceStore } from '@/store/finance-store';
import { useCurrency } from '@/hooks/use-currency';
import { CurrencyCode } from '@/lib/currency';
import { format, parseISO } from 'date-fns';
import { Switch } from '@headlessui/react';
import { clsx } from 'clsx';

export function BillList() {
  const bills = useFinanceStore((state) => state.bills);
  const toggleAutopay = useFinanceStore((state) => state.toggleBillAutopay);
  const { display } = useCurrency();

  if (!bills.length) return null;

  return (
    <div className="space-y-3">
      {bills.map((bill) => (
        <div
          key={bill.id}
          className="flex items-center justify-between rounded-3xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-lg shadow-indigo-950/20"
        >
          <div>
            <p className="text-lg font-semibold text-slate-100">{bill.name}</p>
            <p className="text-xs text-slate-400">
              {format(parseISO(bill.nextDue), 'dd MMM yyyy')} • {bill.cycle}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-amber-300">
              {display(bill.amount, bill.currency as CurrencyCode)}
            </span>
            <Switch
              checked={bill.autopay}
              onChange={() => toggleAutopay(bill.id)}
              className={clsx(
                'inline-flex h-6 w-11 items-center rounded-full transition',
                bill.autopay ? 'bg-emerald-400/80' : 'bg-slate-700/80'
              )}
            >
              <span
                className={clsx(
                  'inline-block h-5 w-5 transform rounded-full bg-white transition',
                  bill.autopay ? 'translate-x-5' : 'translate-x-1'
                )}
              />
            </Switch>
          </div>
        </div>
      ))}
    </div>
  );
}
