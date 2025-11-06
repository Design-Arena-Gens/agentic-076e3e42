'use client';

import { useMemo } from 'react';
import { useFinanceStore } from '@/store/finance-store';
import {
  CurrencyCode,
  convertCurrency,
  formatCurrency,
  getCurrencyMeta,
  currencyTable
} from '@/lib/currency';

export function useCurrency() {
  const primaryCurrency = useFinanceStore((state) => state.settings.primaryCurrency as CurrencyCode);

  return useMemo(
    () => ({
      primaryCurrency,
      options: currencyTable,
      meta: getCurrencyMeta(primaryCurrency),
      convertToPrimary: (amount: number, from: CurrencyCode) =>
        convertCurrency(amount, from, primaryCurrency),
      convert: convertCurrency,
      display: (amount: number, code: CurrencyCode = primaryCurrency) =>
        formatCurrency(amount, code)
    }),
    [primaryCurrency]
  );
}
