'use client';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFinanceStore } from '@/store/finance-store';

type TaskFormSchema = {
  name: string;
  due: string;
};

export function TaskForm() {
  const { t } = useTranslation();
  const addTask = useFinanceStore((state) => state.addTask);
  const form = useForm<TaskFormSchema>({
    defaultValues: {
      name: '',
      due: new Date().toISOString().substring(0, 10)
    }
  });

  return (
    <form
      className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30"
      onSubmit={form.handleSubmit((values) => {
        addTask({
          name: values.name,
          due: values.due
        });
        form.reset({
          name: '',
          due: new Date().toISOString().substring(0, 10)
        });
      })}
    >
      <div className="space-y-1">
        <h3 className="font-display text-xl font-semibold text-slate-100">
          {t('forms.task.title')}
        </h3>
        <p className="text-sm text-slate-400">{t('forms.task.description')}</p>
      </div>
      <label className="flex flex-col gap-2 text-sm text-slate-200">
        {t('forms.task.name')}
        <input
          type="text"
          {...form.register('name')}
          className="rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
          required
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-slate-200">
        {t('forms.task.due')}
        <input
          type="date"
          {...form.register('due')}
          className="rounded-2xl border border-slate-800/70 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
          required
        />
      </label>
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
        >
          {t('forms.task.submit')}
        </button>
      </div>
    </form>
  );
}
