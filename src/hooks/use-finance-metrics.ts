'use client';

import { useMemo } from 'react';
import { useFinanceStore } from '@/store/finance-store';
import { CurrencyCode } from '@/lib/currency';
import { useCurrency } from './use-currency';
import { parseISO, isSameMonth } from 'date-fns';

export function useFinanceMetrics() {
  const transactions = useFinanceStore((state) => state.transactions);
  const { convertToPrimary, primaryCurrency } = useCurrency();

  return useMemo(() => {
    const now = new Date();
    const monthTransactions = transactions.filter((tx) => isSameMonth(parseISO(tx.date), now));

    let income = 0;
    let expenses = 0;

    for (const tx of monthTransactions) {
      const converted = convertToPrimary(tx.amount, tx.currency as CurrencyCode);
      if (tx.type === 'income') {
        income += converted;
      } else if (tx.type === 'expense') {
        expenses += converted;
      }
    }

    const netCashflow = income - expenses;
    const daysPassed = Math.max(1, now.getDate());
    const avgDailySpend = expenses / daysPassed;

    return {
      income,
      expenses,
      netCashflow,
      avgDailySpend,
      primaryCurrency
    };
  }, [transactions, convertToPrimary, primaryCurrency]);
}
