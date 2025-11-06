'use client';

import { useFinanceStore, type Settings } from '@/store/finance-store';
import { useTranslation } from 'react-i18next';
import { Switch } from '@headlessui/react';
import { CurrencySelector } from '@/components/currency-selector';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { clsx } from 'clsx';

export default function SettingsPage() {
  const { t } = useTranslation();
  const settings = useFinanceStore((state) => state.settings);
  const updateSettings = useFinanceStore((state) => state.updateSettings);
  const resetWorkspace = useFinanceStore((state) => state.resetWorkspace);

  const toggles = [
    {
      key: 'autoCategorise',
      label: t('settings.autoCategorise')
    },
    {
      key: 'predictCashflow',
      label: t('settings.predictCashflow')
    },
    {
      key: 'enableReminders',
      label: t('settings.enableReminders')
    }
  ] as const;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-bold text-slate-100">{t('settings.title')}</h1>
        <p className="text-sm text-slate-400">{t('app.tagline')}</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30">
          <h2 className="font-semibold text-slate-100">{t('settings.language')}</h2>
          <LanguageSwitcher />
          <p className="text-xs text-slate-400">
            Switch between English and Hindi with instant translation.
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30">
          <h2 className="font-semibold text-slate-100">{t('settings.currency')}</h2>
          <CurrencySelector />
          <p className="text-xs text-slate-400">{t('settings.currencyHint')}</p>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30">
          <h2 className="font-semibold text-slate-100">{t('settings.theme')}</h2>
          <ThemeToggle />
          <p className="text-xs text-slate-400">
            Toggle between dazzling dark and focus-friendly light modes.
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/30">
          <h2 className="font-semibold text-slate-100">Intelligence</h2>
          <div className="space-y-3">
            {toggles.map((toggle) => (
              <ToggleRow
                key={toggle.key}
                label={toggle.label}
                enabled={settings[toggle.key]}
                onToggle={(value) => updateSettings({ [toggle.key]: value } as Partial<Settings>)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-rose-900/70 bg-rose-950/20 p-6 text-rose-100 shadow-inner shadow-rose-900/60">
        <h2 className="font-semibold text-rose-200">{t('settings.reset')}</h2>
        <p className="text-sm text-rose-200/80">
          This will erase all data stored locally on this device. Make sure you have exported the
          workspace first.
        </p>
        <div className="mt-4">
          <button
            type="button"
            onClick={resetWorkspace}
            className="rounded-full border border-rose-400/50 px-5 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
          >
            {t('settings.reset')}
          </button>
        </div>
      </section>
    </div>
  );
}

type ToggleProps = {
  label: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
};

function ToggleRow({ label, enabled, onToggle }: ToggleProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-800/60 bg-slate-900/70 px-4 py-3">
      <span className="text-sm text-slate-200">{label}</span>
      <Switch
        checked={enabled}
        onChange={onToggle}
        className={clsx(
          'inline-flex h-6 w-11 items-center rounded-full transition',
          enabled ? 'bg-emerald-400/80' : 'bg-slate-700/80'
        )}
      >
        <span
          className={clsx(
            'inline-block h-5 w-5 transform rounded-full bg-white transition',
            enabled ? 'translate-x-5' : 'translate-x-1'
          )}
        />
      </Switch>
    </div>
  );
}
