'use client';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFinanceStore } from '@/store/finance-store';
import { transactionCategories } from '@/lib/categories';
import { useCurrency } from '@/hooks/use-currency';
import { CurrencyCode } from '@/lib/currency';

type BudgetFormSchema = {
  name: string;
  category: string;
  limit: number;
  currency: CurrencyCode;
  notify: boolean;
};

export function BudgetForm() {
  const { t } = useTranslation();
  const addBudget = useFinanceStore((state) => state.addBudget);
  const { primaryCurrency, options } = useCurrency();
  const form = useForm<BudgetFormSchema>({
    defaultValues: {
      name: '',
      category: 'food',
      limit: 1000,
      currency: primaryCurrency,
      notify: true
    }
  });

  return (
    <form
      className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30"
      onSubmit={form.handleSubmit((values) => {
        addBudget({
          name: values.name,
          category: values.category,
          limit: Number(values.limit),
          currency: values.currency,
          notify: values.notify
        });
        form.reset({
          name: '',
          category: 'food',
          limit: 1000,
          currency: primaryCurrency,
          notify: true
        });
      })}
    >
      <div className="space-y-1">
        <h3 className="font-display text-xl font-semibold text-slate-100">
          {t('forms.budget.title')}
        </h3>
        <p className="text-sm text-slate-400">{t('forms.budget.description')}</p>
      </div>
      <label className="flex flex-col gap-2 text-sm text-slate-200">
        {t('forms.budget.name')}
        <input
          type="text"
          {...form.register('name')}
          className="rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
          required
        />
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t('forms.budget.category')}
          <select
            {...form.register('category')}
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
          {t('forms.budget.limit')}
          <input
            type="number"
            step="0.01"
            min="0"
            {...form.register('limit', { valueAsNumber: true })}
            className="rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t('forms.transaction.currency')}
          <select
            {...form.register('currency')}
            className="rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
          >
            {options.map((option) => (
              <option key={option.code} value={option.code}>
                {option.code} • {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-3 text-sm text-slate-200">
          <input type="checkbox" {...form.register('notify')} className="h-4 w-4 rounded border-slate-700" />
          {t('forms.budget.notify')}
        </label>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
        >
          {t('forms.budget.submit')}
        </button>
      </div>
    </form>
  );
}
