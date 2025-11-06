'use client';

import { useFinanceStore } from '@/store/finance-store';
import { useCurrency } from '@/hooks/use-currency';
import { CurrencyCode } from '@/lib/currency';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const COLORS = [
  '#818cf8',
  '#a855f7',
  '#f472b6',
  '#f59e0b',
  '#34d399',
  '#38bdf8',
  '#fb7185',
  '#64748b',
  '#c084fc',
  '#60a5fa',
  '#facc15',
  '#f97316'
];

export function CategoryChart() {
  const transactions = useFinanceStore((state) => state.transactions);
  const { convertToPrimary } = useCurrency();
  const { t } = useTranslation();

  const data = useMemo(() => {
    const bucket = new Map<string, number>();

    for (const tx of transactions) {
      if (tx.type !== 'expense') continue;
      const current = bucket.get(tx.category) ?? 0;
      bucket.set(
        tx.category,
        current + convertToPrimary(tx.amount, tx.currency as CurrencyCode)
      );
    }

    return Array.from(bucket.entries()).map(([category, value]) => ({
      name: t(`categories.${category}`),
      value
    }));
  }, [transactions, convertToPrimary, t]);

  if (!data.length) return null;

  return (
    <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30">
      <header>
        <h3 className="font-display text-lg font-semibold text-slate-100">
          {t('dashboard.categorySplit')}
        </h3>
      </header>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={110}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={COLORS[index % COLORS.length]}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid #312e81',
              borderRadius: '16px',
              color: '#e2e8f0'
            }}
            formatter={(value: number) => value.toFixed(2)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
