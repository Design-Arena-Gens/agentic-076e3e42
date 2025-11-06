'use client';

import { BillForm } from '@/components/bill-form';
import { BillList } from '@/components/bill-list';
import { TaskForm } from '@/components/task-form';
import { TaskList } from '@/components/task-list';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

const automationHighlights = [
  {
    key: 'rules.roundup',
    tone: 'from-emerald-500 via-teal-400 to-cyan-500'
  },
  {
    key: 'rules.alerts',
    tone: 'from-indigo-500 via-purple-500 to-pink-500'
  },
  {
    key: 'rules.autoPay',
    tone: 'from-amber-500 via-orange-500 to-rose-500'
  }
];

export default function AutomationPage() {
  const { t } = useTranslation();
  const highlights = useMemo(
    () =>
      automationHighlights.map((item) => ({
        ...item,
        text: t(`automation.${item.key}`)
      })),
    [t]
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-bold text-slate-100">
          {t('automation.title')}
        </h1>
        <p className="max-w-2xl text-sm text-slate-400">{t('automation.subtitle')}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((highlight) => (
          <div
            key={highlight.key}
            className={`rounded-3xl border border-slate-800/60 bg-slate-900/70 p-5 shadow-lg shadow-indigo-950/30`}
          >
            <div
              className={`mb-4 inline-flex rounded-full bg-gradient-to-r ${highlight.tone} px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white`}
            >
              GPT Automation
            </div>
            <p className="text-sm text-slate-200">{highlight.text}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <BillForm />
        <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30">
          <h2 className="font-semibold text-slate-100">{t('dashboard.upcomingBills')}</h2>
          <BillList />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <TaskForm />
        <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30">
          <h2 className="font-semibold text-slate-100">{t('dashboard.upcomingTasks')}</h2>
          <TaskList />
        </div>
      </section>
    </div>
  );
}
