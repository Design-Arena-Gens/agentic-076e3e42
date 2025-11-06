'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

type SupportedLocale = 'en-IN' | 'hi';

type I18nContextValue = {
  locale: SupportedLocale;
  changeLocale: (next: SupportedLocale) => void;
};

const I18nContext = createContext<I18nContextValue>({
  locale: 'en-IN',
  changeLocale: () => {}
});

const STORAGE_KEY = 'finora.locale';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [, i18n] = useTranslation();
  const [locale, setLocale] = useState<SupportedLocale>('en-IN');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as SupportedLocale | null;
    if (stored && stored !== locale) {
      setLocale(stored);
    }
  }, [locale]);

  useEffect(() => {
    void i18n.changeLanguage(locale);
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale, i18n]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      changeLocale: setLocale
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
