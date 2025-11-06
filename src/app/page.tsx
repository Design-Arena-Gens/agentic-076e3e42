'use client';
import { SummaryCards } from '@/components/summary-cards';
import { TransactionForm } from '@/components/transaction-form';
import { TransactionTable } from '@/components/transaction-table';
import { CashflowChart } from '@/components/charts/cashflow-chart';
import { CategoryChart } from '@/components/charts/category-chart';
import { SpendingHeatmap } from '@/components/charts/spending-heatmap';
import { UpcomingHighlights } from '@/components/upcoming-highlights';
import { BudgetForm } from '@/components/budget-form';
import { BudgetList } from '@/components/budget-list';
import { GoalForm } from '@/components/goal-form';
import { GoalList } from '@/components/goal-list';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
      <section className="space-y-6">
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-3xl font-bold text-slate-100">
            {t('dashboard.overview')}
          </h1>
          <p className="max-w-2xl text-sm text-slate-400">
            {t('app.tagline')}
          </p>
        </header>
        <SummaryCards />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <TransactionForm />
        <div className="space-y-6">
          <BudgetForm />
          <GoalForm />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <TransactionTable />
        <div className="space-y-6">
          <BudgetList />
          <GoalList />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <CashflowChart />
        <CategoryChart />
        <SpendingHeatmap />
      </section>

      <section className="space-y-4">
        <header>
          <h2 className="font-display text-2xl font-semibold text-slate-100">
            {t('dashboard.upcoming')}
          </h2>
        </header>
        <UpcomingHighlights />
      </section>
    </div>
  );
}
