'use client';

import { useFinanceStore } from '@/store/finance-store';
import { useCurrency } from '@/hooks/use-currency';
import { CurrencyCode } from '@/lib/currency';
import { differenceInDays, format, parseISO } from 'date-fns';

export function GoalList() {
  const goals = useFinanceStore((state) => state.goals);
  const { display } = useCurrency();

  if (!goals.length) return null;

  return (
    <div className="space-y-3">
      {goals.map((goal) => {
        const percent = Math.min(100, Math.round((goal.progress / goal.target) * 100));
        const daysRemaining = differenceInDays(parseISO(goal.deadline), new Date());

        return (
          <div
            key={goal.id}
            className="space-y-3 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-lg shadow-indigo-950/20"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-semibold text-slate-100">{goal.name}</h4>
                <p className="text-xs text-slate-400">
                  {format(parseISO(goal.deadline), 'dd MMM yyyy')} • {daysRemaining} days left
                </p>
              </div>
              <div className="text-right text-sm text-slate-400">
                <p>{display(goal.target, goal.currency as CurrencyCode)}</p>
              </div>
            </div>
            <div className="h-2.5 rounded-full bg-slate-800/70">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{display(goal.progress, goal.currency as CurrencyCode)}</span>
              <span>{percent}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
