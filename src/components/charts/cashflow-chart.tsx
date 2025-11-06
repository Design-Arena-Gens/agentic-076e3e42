'use client';

import { useFinanceStore } from '@/store/finance-store';
import { useCurrency } from '@/hooks/use-currency';
import { CurrencyCode } from '@/lib/currency';
import { format, parseISO } from 'date-fns';
import { useMemo } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTranslation } from 'react-i18next';

type ChartDatum = {
  date: string;
  label: string;
  income: number;
  expense: number;
};

export function CashflowChart() {
  const transactions = useFinanceStore((state) => state.transactions);
  const { convertToPrimary, display, primaryCurrency } = useCurrency();
  const { t } = useTranslation();

  const data = useMemo<ChartDatum[]>(() => {
    const map = new Map<string, ChartDatum>();

    for (const tx of transactions) {
      const key = tx.date;
      if (!map.has(key)) {
        map.set(key, {
          date: key,
          label: format(parseISO(key), 'dd MMM'),
          income: 0,
          expense: 0
        });
      }
      const row = map.get(key)!;
      const converted = convertToPrimary(tx.amount, tx.currency as CurrencyCode);
      if (tx.type === 'income') row.income += converted;
      if (tx.type === 'expense') row.expense += converted;
    }

    return Array.from(map.values()).sort(
      (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
    );
  }, [transactions, convertToPrimary]);

  if (!data.length) return null;

  return (
    <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30">
      <header>
        <h3 className="font-display text-lg font-semibold text-slate-100">
          {t('dashboard.cashflowTrend')}
        </h3>
        <p className="text-sm text-slate-400">{primaryCurrency}</p>
      </header>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="label"
            stroke="#94a3b8"
            tickLine={false}
            axisLine={{ stroke: '#1e293b' }}
          />
          <YAxis stroke="#94a3b8" tickFormatter={(value) => display(value)} width={100} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid #312e81',
              borderRadius: '16px',
              color: '#e2e8f0'
            }}
            formatter={(value: number) => display(value)}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#34d399"
            strokeWidth={2.2}
            dot={false}
            name={t('forms.transaction.types.income')}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#fb7185"
            strokeWidth={2.2}
            dot={false}
            name={t('forms.transaction.types.expense')}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
