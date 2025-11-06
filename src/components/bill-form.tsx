'use client';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFinanceStore } from '@/store/finance-store';
import { useCurrency } from '@/hooks/use-currency';
import { CurrencyCode } from '@/lib/currency';

type BillFormSchema = {
  name: string;
  amount: number;
  currency: CurrencyCode;
  cycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextDue: string;
  autopay: boolean;
};

export function BillForm() {
  const { t } = useTranslation();
  const addBill = useFinanceStore((state) => state.addBill);
  const { primaryCurrency, options } = useCurrency();
  const form = useForm<BillFormSchema>({
    defaultValues: {
      name: '',
      amount: 0,
      currency: primaryCurrency,
      cycle: 'monthly',
      nextDue: new Date().toISOString().substring(0, 10),
      autopay: false
    }
  });

  return (
    <form
      className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30"
      onSubmit={form.handleSubmit((values) => {
        addBill({
          name: values.name,
          amount: Number(values.amount),
          currency: values.currency,
          cycle: values.cycle,
          nextDue: values.nextDue,
          autopay: values.autopay
        });
        form.reset({
          name: '',
          amount: 0,
          currency: primaryCurrency,
          cycle: 'monthly',
          nextDue: new Date().toISOString().substring(0, 10),
          autopay: false
        });
      })}
    >
      <div className="space-y-1">
        <h3 className="font-display text-xl font-semibold text-slate-100">
          {t('forms.bill.title')}
        </h3>
        <p className="text-sm text-slate-400">{t('forms.bill.description')}</p>
      </div>
      <label className="flex flex-col gap-2 text-sm text-slate-200">
        {t('forms.bill.name')}
        <input
          type="text"
          {...form.register('name')}
          className="rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
          required
        />
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t('forms.bill.amount')}
          <input
            type="number"
            min="0"
            step="0.01"
            {...form.register('amount', { valueAsNumber: true })}
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
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t('forms.bill.cycle')}
          <select
            {...form.register('cycle')}
            className="rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          {t('forms.bill.dueDate')}
          <input
            type="date"
            {...form.register('nextDue')}
            className="rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
            required
          />
        </label>
      </div>
      <label className="flex items-center gap-3 rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-3 text-sm text-slate-200">
        <input type="checkbox" {...form.register('autopay')} className="h-4 w-4 rounded border-slate-700" />
        Auto Pay
      </label>
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
        >
          {t('forms.bill.submit')}
        </button>
      </div>
    </form>
  );
}
