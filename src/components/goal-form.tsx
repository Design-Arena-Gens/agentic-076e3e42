'use client';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFinanceStore } from '@/store/finance-store';
import { useCurrency } from '@/hooks/use-currency';
import { CurrencyCode } from '@/lib/currency';

type GoalFormSchema = {
  name: string;
  target: number;
  deadline: string;
  currency: CurrencyCode;
};

export function GoalForm() {
  const { t } = useTranslation();
  const addGoal = useFinanceStore((state) => state.addGoal);
  const { primaryCurrency, options } = useCurrency();
  const form = useForm<GoalFormSchema>({
    defaultValues: {
      name: '',
      target: 50000,
      deadline: new Date().toISOString().substring(0, 10),
      currency: primaryCurrency
    }
  });

  return (
    <form
      className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30"
      onSubmit={form.handleSubmit((values) => {
        addGoal({
          name: values.name,
          target: Number(values.target),
          deadline: values.deadline,
          currency: values.currency
        });
        form.reset({
          name: '',
          target: 50000,
          deadline: new Date().toISOString().substring(0, 10),
          currency: primaryCurrency
        });
      })}
    >
      <div className="space-y-1">
        <h3 className="font-display text-xl font-semibold text-slate-100">
          {t('forms.goal.title')}
        </h3>
        <p className="text-sm text-slate-400">{t('forms.goal.description')}</p>
      </div>
      <label className="flex flex-col gap-2 text-sm text-slate-200">
        {t('forms.goal.name')}
        <input
          type="text"
          {...form.register('name')}
          className="rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
          required
        />
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t('forms.goal.target')}
          <input
            type="number"
            min="0"
            {...form.register('target', { valueAsNumber: true })}
            className="rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t('forms.goal.deadline')}
          <input
            type="date"
            {...form.register('deadline')}
            className="rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            required
          />
        </label>
        <label className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-200">
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
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
        >
          {t('forms.goal.submit')}
        </button>
      </div>
    </form>
  );
}
