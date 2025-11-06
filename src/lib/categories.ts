export const transactionCategories = [
  'housing',
  'food',
  'transport',
  'personal',
  'entertainment',
  'subscriptions',
  'utilities',
  'health',
  'travel',
  'education',
  'salary',
  'business',
  'freelance',
  'other'
] as const;

export type TransactionCategory = (typeof transactionCategories)[number];
