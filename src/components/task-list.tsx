'use client';

import { useFinanceStore } from '@/store/finance-store';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';

export function TaskList() {
  const tasks = useFinanceStore((state) => state.tasks);
  const toggleTask = useFinanceStore((state) => state.toggleTask);
  const { t } = useTranslation();

  if (!tasks.length) return null;

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <button
          key={task.id}
          type="button"
          onClick={() => toggleTask(task.id)}
          className={`flex w-full items-center justify-between rounded-3xl border border-slate-800/70 px-4 py-3 text-left transition ${
            task.complete ? 'bg-emerald-500/10 text-emerald-200' : 'bg-slate-900/60 text-slate-200'
          }`}
        >
          <div>
            <p className="font-medium">{task.name}</p>
            <p className="text-xs text-slate-400">
              {format(parseISO(task.due), 'dd MMM yyyy')}
            </p>
          </div>
          <span className="text-xs uppercase tracking-wide">
            {task.complete ? t('actions.save') : t('actions.start')}
          </span>
        </button>
      ))}
    </div>
  );
}
