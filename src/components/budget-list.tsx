'use client';

import { useFinanceStore } from '@/store/finance-store';
import { CurrencyCode } from '@/lib/currency';
import { useCurrency } from '@/hooks/use-currency';
import { useTranslation } from 'react-i18next';
import { transactionCategories } from '@/lib/categories';

export function BudgetList() {
  const budgets = useFinanceStore((state) => state.budgets);
  const transactions = useFinanceStore((state) => state.transactions);
  const { convertToPrimary, display } = useCurrency();
  const { t } = useTranslation();

  if (!budgets.length) return null;

  return (
    <div className="space-y-3">
      {budgets.map((budget) => {
        const spent = transactions
          .filter((tx) => tx.type === 'expense' && tx.category === budget.category)
          .reduce(
            (acc, tx) => acc + convertToPrimary(tx.amount, tx.currency as CurrencyCode),
            0
          );
        const limitInPrimary = convertToPrimary(budget.limit, budget.currency as CurrencyCode);
        const percent = Math.min(100, Math.round((spent / limitInPrimary) * 100));

        return (
          <div
            key={budget.id}
            className="space-y-3 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-lg shadow-indigo-950/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-indigo-300">
                  {t(`categories.${budget.category as (typeof transactionCategories)[number]}`)}
                </p>
                <h4 className="text-lg font-semibold text-slate-100">{budget.name}</h4>
              </div>
              <div className="text-right text-sm text-slate-400">
                <p>{display(spent)}</p>
                <p className="text-xs">
                  {t('forms.transaction.currency')}: {budget.currency}
                </p>
              </div>
            </div>
            <div className="h-2.5 rounded-full bg-slate-800/70">
              <div
                className={`h-2.5 rounded-full ${
                  percent >= 90
                    ? 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400'
                    : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{display(limitInPrimary)}</span>
              <span>{percent}% used</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
