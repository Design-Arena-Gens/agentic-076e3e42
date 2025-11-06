'use client';

import { useFinanceMetrics } from '@/hooks/use-finance-metrics';
import { useCurrency } from '@/hooks/use-currency';
import { TrendingUp, TrendingDown, Wallet, Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SummaryCards() {
  const metrics = useFinanceMetrics();
  const { display } = useCurrency();
  const { t } = useTranslation();

  const cards = [
    {
      title: t('dashboard.totalSpend'),
      value: display(metrics.expenses),
      icon: TrendingDown,
      tone: 'text-rose-300 bg-rose-500/10'
    },
    {
      title: t('dashboard.netCashflow'),
      value: display(metrics.netCashflow),
      icon: metrics.netCashflow >= 0 ? TrendingUp : TrendingDown,
      tone:
        metrics.netCashflow >= 0
          ? 'text-emerald-300 bg-emerald-500/10'
          : 'text-rose-300 bg-rose-500/10'
    },
    {
      title: t('dashboard.avgPerDay'),
      value: display(metrics.avgDailySpend),
      icon: Wallet,
      tone: 'text-sky-300 bg-sky-500/10'
    },
    {
      title: metrics.netCashflow >= 0 ? t('dashboard.surplus') : t('dashboard.deficit'),
      value: display(Math.abs(metrics.netCashflow)),
      icon: Coins,
      tone: 'text-amber-300 bg-amber-500/10'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-lg shadow-indigo-950/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">{card.title}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-100">{card.value}</p>
            </div>
            <div className={`rounded-2xl p-3 ${card.tone}`}>
              <card.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
