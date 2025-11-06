'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './language-switcher';
import { CurrencySelector } from './currency-selector';
import { ThemeToggle } from './theme-toggle';
import { clsx } from 'clsx';
import type { Route } from 'next';

const navItems: Array<{ href: Route; key: string }> = [
  { href: '/' as Route, key: 'nav.dashboard' },
  { href: '/insights' as Route, key: 'nav.insights' },
  { href: '/automation' as Route, key: 'nav.automation' },
  { href: '/settings' as Route, key: 'nav.settings' }
];

export function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-cyan-400 p-2 shadow-glow">
            <span className="text-lg font-bold text-white">ƒ</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-tight text-slate-100">
              {t('app.name')}
            </span>
            <span className="text-xs text-slate-400">{t('app.tagline')}</span>
          </div>
        </Link>

        <nav className="hidden gap-2 rounded-full border border-slate-800/70 bg-slate-900/60 p-1.5 text-sm font-medium text-slate-300 shadow-lg lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'rounded-full px-4 py-2 transition',
                  active
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-white shadow-glow'
                    : 'hover:bg-indigo-500/10 hover:text-indigo-100'
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <CurrencySelector />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
