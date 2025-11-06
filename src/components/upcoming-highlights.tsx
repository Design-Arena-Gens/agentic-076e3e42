'use client';

import { useFinanceStore } from '@/store/finance-store';
import { format, isAfter, parseISO, differenceInDays } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { AlarmClock, CalendarCheck2, Target } from 'lucide-react';
import { useCurrency } from '@/hooks/use-currency';
import { CurrencyCode } from '@/lib/currency';

export function UpcomingHighlights() {
  const bills = useFinanceStore((state) => state.bills);
  const goals = useFinanceStore((state) => state.goals);
  const tasks = useFinanceStore((state) => state.tasks);
  const { t } = useTranslation();
  const { display, convertToPrimary } = useCurrency();

  const upcomingBills = bills
    .filter((bill) => isAfter(parseISO(bill.nextDue), new Date()))
    .sort(
      (a, b) => parseISO(a.nextDue).getTime() - parseISO(b.nextDue).getTime()
    )
    .slice(0, 3);

  const upcomingGoals = goals
    .filter((goal) => isAfter(parseISO(goal.deadline), new Date()))
    .sort(
      (a, b) => parseISO(a.deadline).getTime() - parseISO(b.deadline).getTime()
    )
    .slice(0, 3);

  const upcomingTasks = tasks
    .filter((task) => !task.complete && isAfter(parseISO(task.due), new Date()))
    .sort((a, b) => parseISO(a.due).getTime() - parseISO(b.due).getTime())
    .slice(0, 4);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="min-h-[220px] rounded-3xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-xl shadow-indigo-950/30">
        <header className="mb-4 flex items-center gap-2 text-slate-200">
          <AlarmClock className="h-5 w-5 text-amber-300" />
          <h3 className="font-semibold">{t('dashboard.upcomingBills')}</h3>
        </header>
        <div className="space-y-3 text-sm text-slate-300">
          {upcomingBills.length ? (
            upcomingBills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between rounded-2xl border border-slate-800/60 bg-slate-900/70 px-3 py-2"
              >
                <div className="space-y-0.5">
                  <p className="font-medium text-slate-100">{bill.name}</p>
                  <p className="text-xs text-slate-400">
                    {format(parseISO(bill.nextDue), 'dd MMM yyyy')} • {bill.cycle}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-300">
                    {display(convertToPrimary(bill.amount, bill.currency as CurrencyCode))}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {differenceInDays(parseISO(bill.nextDue), new Date())} days
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">
              {t('dashboard.emptyState')}
            </p>
          )}
        </div>
      </div>
      <div className="min-h-[220px] rounded-3xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-xl shadow-indigo-950/30">
        <header className="mb-4 flex items-center gap-2 text-slate-200">
          <Target className="h-5 w-5 text-emerald-300" />
          <h3 className="font-semibold">{t('dashboard.upcomingGoals')}</h3>
        </header>
        <div className="space-y-3 text-sm text-slate-300">
          {upcomingGoals.length ? (
            upcomingGoals.map((goal) => {
              const percent = Math.min(100, Math.round((goal.progress / goal.target) * 100));
              return (
                <div
                  key={goal.id}
                  className="space-y-2 rounded-2xl border border-slate-800/60 bg-slate-900/70 px-3 py-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-100">{goal.name}</p>
                      <p className="text-xs text-slate-400">
                        {format(parseISO(goal.deadline), 'dd MMM yyyy')}
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-400">{percent}%</div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800/70">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {display(goal.progress, goal.currency as CurrencyCode)} /{' '}
                    {display(goal.target, goal.currency as CurrencyCode)}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-500">
              {t('dashboard.emptyState')}
            </p>
          )}
        </div>
      </div>
      <div className="min-h-[220px] rounded-3xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-xl shadow-indigo-950/30">
        <header className="mb-4 flex items-center gap-2 text-slate-200">
          <CalendarCheck2 className="h-5 w-5 text-sky-300" />
          <h3 className="font-semibold">{t('dashboard.upcomingTasks')}</h3>
        </header>
        <div className="space-y-3 text-sm text-slate-300">
          {upcomingTasks.length ? (
            upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-2xl border border-slate-800/60 bg-slate-900/70 px-3 py-2"
              >
                <div>
                  <p className="font-medium text-slate-100">{task.name}</p>
                  <p className="text-xs text-slate-400">
                    {format(parseISO(task.due), 'dd MMM yyyy')}
                  </p>
                </div>
                <span className="text-[11px] text-slate-500">
                  {differenceInDays(parseISO(task.due), new Date())} days
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">
              {t('dashboard.emptyState')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
