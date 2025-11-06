'use client';

import { useFinanceStore } from '@/store/finance-store';
import { useCurrency } from '@/hooks/use-currency';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { ArrowDownCircle, ArrowUpCircle, MinusCircle, Trash2 } from 'lucide-react';
import { CurrencyCode } from '@/lib/currency';

const typeStyles: Record<string, { icon: React.ElementType; tone: string }> = {
  income: { icon: ArrowUpCircle, tone: 'text-emerald-300' },
  expense: { icon: ArrowDownCircle, tone: 'text-rose-300' },
  transfer: { icon: MinusCircle, tone: 'text-sky-300' }
};

export function TransactionTable() {
  const { t } = useTranslation();
  const transactions = useFinanceStore((state) => state.transactions);
  const removeTransaction = useFinanceStore((state) => state.removeTransaction);
  const { display, convertToPrimary, primaryCurrency } = useCurrency();

  const rows = useMemo(() => transactions.slice(0, 8), [transactions]);

  if (!rows.length) {
    return (
      <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800/70 bg-slate-900/40 px-6 text-center text-sm text-slate-400">
        {t('dashboard.emptyState')}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-900/60 shadow-xl shadow-indigo-950/30">
      <table className="min-w-full divide-y divide-slate-800/80">
        <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-6 py-4 text-left">{t('forms.transaction.type')}</th>
            <th className="px-6 py-4 text-left">{t('forms.transaction.category')}</th>
            <th className="px-6 py-4 text-left">{t('forms.transaction.amount')}</th>
            <th className="px-6 py-4 text-left">{t('forms.transaction.currency')}</th>
            <th className="px-6 py-4 text-left">{t('forms.transaction.date')}</th>
            <th className="px-6 py-4 text-left">{t('forms.transaction.notes')}</th>
            <th className="px-6 py-4 text-right">{t('actions.delete')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-sm text-slate-200">
          {rows.map((tx) => {
            const typeStyle = typeStyles[tx.type] ?? typeStyles.expense;
            const Icon = typeStyle.icon;
            const converted = convertToPrimary(tx.amount, tx.currency as CurrencyCode);
            return (
              <tr key={tx.id} className="hover:bg-slate-800/40">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full bg-slate-800/80 p-2 ${typeStyle.tone}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-semibold">
                      {t(`forms.transaction.types.${tx.type}` as const)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">{t(`categories.${tx.category}`)}</td>
                <td className="px-6 py-4 font-semibold">
                  {display(converted)}{' '}
                  <span className="text-xs text-slate-400">
                    ({display(tx.amount, tx.currency as CurrencyCode)}
                    {tx.currency !== primaryCurrency ? ` • ${tx.currency}` : ''})
                  </span>
                </td>
                <td className="px-6 py-4">{tx.currency}</td>
                <td className="px-6 py-4 text-slate-400">
                  {format(parseISO(tx.date), 'dd MMM yyyy')}
                </td>
                <td className="px-6 py-4 text-slate-300">{tx.notes ?? '—'}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => removeTransaction(tx.id)}
                    className="rounded-full border border-slate-700/60 p-2 text-slate-400 transition hover:border-rose-500/60 hover:text-rose-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
