'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Globe2 } from 'lucide-react';
import { useI18n } from './providers/i18n-provider';
import { useTranslation } from 'react-i18next';

const languages = [
  {
    code: 'en-IN' as const,
    label: 'English (India)'
  },
  {
    code: 'hi' as const,
    label: 'हिन्दी'
  }
];

export function LanguageSwitcher() {
  const { locale, changeLocale } = useI18n();
  const { t } = useTranslation();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center gap-2 rounded-full bg-slate-800/60 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700/50">
        <Globe2 className="h-4 w-4" />
        <span>{languages.find((item) => item.code === locale)?.label}</span>
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
        <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-2xl border border-slate-700/70 bg-slate-900/95 p-1 shadow-2xl">
          {languages.map((item) => (
            <Menu.Item key={item.code}>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => changeLocale(item.code)}
                  className={`flex w-full flex-col items-start rounded-xl px-4 py-2.5 text-sm ${
                    active || locale === item.code ? 'bg-indigo-500/10 text-indigo-100' : 'text-slate-300'
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs text-slate-400">{t('settings.language')}</span>
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
