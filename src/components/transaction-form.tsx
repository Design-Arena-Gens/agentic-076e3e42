'use client';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFinanceStore } from '@/store/finance-store';
import { useCurrency } from '@/hooks/use-currency';
import { transactionCategories } from '@/lib/categories';
import { CurrencyCode } from '@/lib/currency';
import { useMemo } from 'react';

type TransactionFormSchema = {
  amount: number;
  currency: CurrencyCode;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  date: string;
  notes?: string;
};

export function TransactionForm() {
  const { t } = useTranslation();
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const { primaryCurrency, options } = useCurrency();

  const defaultDate = useMemo(() => new Date().toISOString().substring(0, 10), []);

  const { register, handleSubmit, reset } = useForm<TransactionFormSchema>({
    defaultValues: {
      amount: 0,
      currency: primaryCurrency,
      type: 'expense',
      category: 'food',
      date: defaultDate
    }
  });

  return (
    <form
      onSubmit={handleSubmit((values) => {
        addTransaction({
          amount: Number(values.amount),
          category: values.category,
          currency: values.currency,
          date: values.date,
          notes: values.notes,
          type: values.type
        });
        reset({ amount: 0, currency: primaryCurrency, type: 'expense', category: 'food', date: defaultDate });
      })}
      className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30"
    >
      <div className="space-y-1">
        <h3 className="font-display text-xl font-semibold text-slate-100">
          {t('forms.transaction.title')}
        </h3>
        <p className="text-sm text-slate-400">{t('forms.transaction.description')}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t('forms.transaction.amount')}
          <input
            type="number"
            step="0.01"
            min="0"
            {...register('amount', { valueAsNumber: true })}
            className="rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t('forms.transaction.currency')}
          <select
            {...register('currency')}
            className="rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
          >
            {options.map((option) => (
              <option key={option.code} value={option.code}>
                {option.code} • {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t('forms.transaction.type')}
          <select
            {...register('type')}
            className="rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
          >
            <option value="income">{t('forms.transaction.types.income')}</option>
            <option value="expense">{t('forms.transaction.types.expense')}</option>
            <option value="transfer">{t('forms.transaction.types.transfer')}</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t('forms.transaction.category')}
          <select
            {...register('category')}
            className="rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
          >
            {transactionCategories.map((category) => (
              <option key={category} value={category}>
                {t(`categories.${category}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t('forms.transaction.date')}
          <input
            type="date"
            {...register('date')}
            className="rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
          />
        </label>
        <label className="md:col-span-2">
          <span className="text-sm text-slate-200">{t('forms.transaction.notes')}</span>
          <textarea
            rows={3}
            {...register('notes')}
            className="mt-2 w-full rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            placeholder="What did you purchase?"
          />
        </label>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
        >
          {t('forms.transaction.submit')}
        </button>
      </div>
    </form>
  );
}
