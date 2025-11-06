export type CurrencyCode =
  | 'INR'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'AUD'
  | 'CAD'
  | 'JPY'
  | 'CNY'
  | 'AED'
  | 'SGD'
  | 'CHF'
  | 'ZAR';

type CurrencyMeta = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  toInr: number;
};

export const currencyTable: CurrencyMeta[] = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee', toInr: 1 },
  { code: 'USD', symbol: '$', label: 'US Dollar', toInr: 83.24 },
  { code: 'EUR', symbol: '€', label: 'Euro', toInr: 90.12 },
  { code: 'GBP', symbol: '£', label: 'British Pound', toInr: 104.56 },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar', toInr: 54.01 },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar', toInr: 60.85 },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen', toInr: 0.53 },
  { code: 'CNY', symbol: '¥', label: 'Chinese Yuan', toInr: 11.55 },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham', toInr: 22.68 },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar', toInr: 61.76 },
  { code: 'CHF', symbol: 'Fr', label: 'Swiss Franc', toInr: 92.04 },
  { code: 'ZAR', symbol: 'R', label: 'South African Rand', toInr: 4.38 }
];

const map = currencyTable.reduce<Record<CurrencyCode, CurrencyMeta>>((acc, item) => {
  acc[item.code] = item;
  return acc;
}, {} as Record<CurrencyCode, CurrencyMeta>);

export const getCurrencyMeta = (code: CurrencyCode) => map[code];

export const currencyCodes = currencyTable.map((item) => item.code);

export function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  const fromMeta = map[from];
  const toMeta = map[to];
  if (!fromMeta || !toMeta) return amount;
  const amountInInr = amount * fromMeta.toInr;
  return amountInInr / toMeta.toInr;
}

export function formatCurrency(amount: number, code: CurrencyCode) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: code
  }).format(amount);
}
