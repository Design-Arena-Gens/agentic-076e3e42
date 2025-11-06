'use client';

import { eachDayOfInterval, endOfDay, startOfDay, subDays } from 'date-fns';
import { useFinanceStore } from '@/store/finance-store';
import { useCurrency } from '@/hooks/use-currency';
import { CurrencyCode } from '@/lib/currency';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type HeatCell = {
  date: Date;
  value: number;
};

const intensity = ['bg-slate-800/60', 'bg-indigo-900/50', 'bg-indigo-700/60', 'bg-indigo-500/60', 'bg-cyan-400/70'];

export function SpendingHeatmap() {
  const transactions = useFinanceStore((state) => state.transactions);
  const { convertToPrimary, display } = useCurrency();
  const { t } = useTranslation();

  const days = useMemo(() => {
    const today = endOfDay(new Date());
    const start = startOfDay(subDays(today, 27));
    const interval = eachDayOfInterval({ start, end: today });
    const map = new Map<string, HeatCell>();

    for (const day of interval) {
      map.set(format(day, 'yyyy-MM-dd'), { date: day, value: 0 });
    }

    for (const tx of transactions) {
      if (tx.type !== 'expense') continue;
      const key = format(new Date(tx.date), 'yyyy-MM-dd');
      if (!map.has(key)) continue;
      const cell = map.get(key)!;
      cell.value += convertToPrimary(tx.amount, tx.currency as CurrencyCode);
    }

    const values = Array.from(map.values());
    const max = values.reduce((acc, item) => Math.max(acc, item.value), 0);

    return values.map((cell) => ({
      ...cell,
      intensity: max === 0 ? 0 : Math.min(intensity.length - 1, Math.ceil((cell.value / max) * (intensity.length - 1)))
    }));
  }, [transactions, convertToPrimary]);

  if (!days.length) return null;

  return (
    <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30">
      <header>
        <h3 className="font-display text-lg font-semibold text-slate-100">
          {t('dashboard.heatmapTitle')}
        </h3>
        <p className="text-sm text-slate-400">Last 4 weeks</p>
      </header>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((cell) => (
          <div
            key={cell.date.toISOString()}
            className={`group relative h-12 rounded-xl transition hover:ring-2 hover:ring-cyan-400/50 ${intensity[cell.intensity]}`}
          >
            <div className="absolute inset-0 flex flex-col justify-end p-1 text-[10px] text-slate-300 opacity-0 transition group-hover:opacity-100">
              <span>{format(cell.date, 'dd MMM')}</span>
              <span className="text-[9px] text-slate-400">{display(cell.value)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span>Low</span>
        <div className="flex flex-1 gap-1">
          {intensity.map((tone, idx) => (
            <div key={idx} className={`h-2 rounded-full ${tone}`} />
          ))}
        </div>
        <span>High</span>
      </div>
    </div>
  );
}
