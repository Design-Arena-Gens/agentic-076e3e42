'use client';

import { useMemo } from 'react';
import { useFinanceStore } from '@/store/finance-store';
import { useCurrency } from '@/hooks/use-currency';
import { CurrencyCode } from '@/lib/currency';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function InsightsPage() {
  const { t } = useTranslation();
  const transactions = useFinanceStore((state) => state.transactions);
  const goals = useFinanceStore((state) => state.goals);
  const { convertToPrimary, display } = useCurrency();

  const projection = useMemo(() => {
    const income = transactions
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + convertToPrimary(tx.amount, tx.currency as CurrencyCode), 0);
    const expense = transactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + convertToPrimary(tx.amount, tx.currency as CurrencyCode), 0);
    const net = income - expense;

    return Array.from({ length: 6 }, (_, idx) => ({
      month: `M${idx + 1}`,
      forecast: net * (idx + 1),
      burn: expense * (idx + 1)
    }));
  }, [transactions, convertToPrimary]);

  const categoryRanking = useMemo(() => {
    const map = new Map<string, number>();
    for (const tx of transactions) {
      if (tx.type !== 'expense') continue;
      map.set(
        tx.category,
        (map.get(tx.category) ?? 0) + convertToPrimary(tx.amount, tx.currency as CurrencyCode)
      );
    }
    return Array.from(map.entries())
      .map(([category, value]) => ({
        category,
        value
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions, convertToPrimary]);

  const burnDown = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === 'expense')
      .map((tx) => ({
        date: parseISO(tx.date),
        value: convertToPrimary(tx.amount, tx.currency as CurrencyCode)
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .reduce<{ date: string; cumulative: number }[]>((acc, item) => {
        const prev = acc[acc.length - 1]?.cumulative ?? 0;
        acc.push({
          date: item.date.toISOString().substring(0, 10),
          cumulative: prev + item.value
        });
        return acc;
      }, []);
  }, [transactions, convertToPrimary]);

  const savingsTrajectory = useMemo(() => {
    return goals.map((goal) => ({
      name: goal.name,
      target: convertToPrimary(goal.target, goal.currency as CurrencyCode),
      progress: convertToPrimary(goal.progress, goal.currency as CurrencyCode)
    }));
  }, [goals, convertToPrimary]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-bold text-slate-100">
          {t('insights.title')}
        </h1>
        <p className="max-w-2xl text-sm text-slate-400">{t('insights.subtitle')}</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30">
          <h2 className="font-semibold text-slate-200">{t('insights.cashflowProjection')}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={projection}>
              <defs>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBurn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => display(value)} />
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
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="#34d399"
                fillOpacity={1}
                fill="url(#colorForecast)"
                name="Forecast"
              />
              <Area
                type="monotone"
                dataKey="burn"
                stroke="#f97316"
                fillOpacity={1}
                fill="url(#colorBurn)"
                name="Burn"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30">
          <h2 className="font-semibold text-slate-200">{t('insights.categoryRanking')}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryRanking}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="category" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => display(value)} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #312e81',
                  borderRadius: '16px',
                  color: '#e2e8f0'
                }}
                formatter={(value: number) => display(value)}
              />
              <Bar dataKey="value" fill="#818cf8" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30">
          <h2 className="font-semibold text-slate-200">{t('insights.burnDown')}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={burnDown}>
              <defs>
                <linearGradient id="colorBurnDown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => display(value)} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #312e81',
                  borderRadius: '16px',
                  color: '#e2e8f0'
                }}
                formatter={(value: number) => display(value)}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#fb7185"
                fill="url(#colorBurnDown)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30">
          <h2 className="font-semibold text-slate-200">{t('insights.savingsTrajectory')}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={savingsTrajectory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#94a3b8" tickFormatter={(value) => display(value)} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" width={120} />
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
              <Bar dataKey="target" fill="#38bdf8" radius={[0, 12, 12, 0]} name="Target" />
              <Bar dataKey="progress" fill="#34d399" radius={[0, 12, 12, 0]} name="Progress" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
