'use client';

import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/hooks/use-currency';
import { useFinanceStore } from '@/store/finance-store';
import { Menu, Transition } from '@headlessui/react';
import { Coins } from 'lucide-react';
import { Fragment } from 'react';

export function CurrencySelector() {
  const { t } = useTranslation();
  const { options, primaryCurrency } = useCurrency();
  const setPrimaryCurrency = useFinanceStore((state) => state.setPrimaryCurrency);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center gap-2 rounded-full bg-slate-800/60 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700/50">
        <Coins className="h-4 w-4" />
        <span>{primaryCurrency}</span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl border border-slate-700/70 bg-slate-900/95 p-1 shadow-2xl">
          <div className="px-3 py-2 text-xs uppercase tracking-wide text-slate-400">
            {t('settings.currencyHint')}
          </div>
          {options.map((currency) => (
            <Menu.Item key={currency.code}>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => setPrimaryCurrency(currency.code)}
                  className={`flex w-full flex-col items-start gap-0.5 rounded-xl px-4 py-2 text-sm ${
                    active || primaryCurrency === currency.code
                      ? 'bg-indigo-500/10 text-indigo-100'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="font-semibold">
                    {currency.symbol} {currency.code}
                  </span>
                  <span className="text-xs text-slate-400">{currency.label}</span>
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
