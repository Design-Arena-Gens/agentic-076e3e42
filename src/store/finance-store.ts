'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type TransactionType = 'income' | 'expense' | 'transfer';

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  category: string;
  date: string;
  notes?: string;
  createdAt: string;
};

export type Budget = {
  id: string;
  name: string;
  category: string;
  limit: number;
  currency: string;
  notify: boolean;
};

export type Goal = {
  id: string;
  name: string;
  target: number;
  currency: string;
  deadline: string;
  progress: number;
};

export type RecurringBill = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  cycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextDue: string;
  autopay: boolean;
};

export type LifeTask = {
  id: string;
  name: string;
  due: string;
  complete: boolean;
};

export type Settings = {
  primaryCurrency: string;
  autoCategorise: boolean;
  predictCashflow: boolean;
  enableReminders: boolean;
};

type FinanceState = {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  bills: RecurringBill[];
  tasks: LifeTask[];
  settings: Settings;
  addTransaction: (input: Omit<Transaction, 'id' | 'createdAt'>) => void;
  removeTransaction: (id: string) => void;
  addBudget: (input: Omit<Budget, 'id'>) => void;
  addGoal: (input: Omit<Goal, 'id' | 'progress'>) => void;
  updateGoalProgress: (id: string, amount: number) => void;
  addBill: (input: Omit<RecurringBill, 'id'>) => void;
  toggleBillAutopay: (id: string) => void;
  addTask: (input: Omit<LifeTask, 'id' | 'complete'>) => void;
  toggleTask: (id: string) => void;
  setPrimaryCurrency: (currency: string) => void;
  updateSettings: (input: Partial<Settings>) => void;
  resetWorkspace: () => void;
};

const defaultSettings: Settings = {
  primaryCurrency: 'INR',
  autoCategorise: true,
  predictCashflow: true,
  enableReminders: true
};

const initialState: Omit<
  FinanceState,
  | 'addTransaction'
  | 'removeTransaction'
  | 'addBudget'
  | 'addGoal'
  | 'updateGoalProgress'
  | 'addBill'
  | 'toggleBillAutopay'
  | 'addTask'
  | 'toggleTask'
  | 'setPrimaryCurrency'
  | 'updateSettings'
  | 'resetWorkspace'
> =
  {
    transactions: [],
    budgets: [],
    goals: [],
    bills: [],
    tasks: [],
    settings: defaultSettings
  };

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      ...initialState,
      addTransaction: (input) =>
        set((state) => ({
          transactions: [
            {
              ...input,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString()
            },
            ...state.transactions
          ]
        })),
      removeTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id)
        })),
      addBudget: (input) =>
        set((state) => ({
          budgets: [
            ...state.budgets,
            {
              ...input,
              id: crypto.randomUUID()
            }
          ]
        })),
      addGoal: (input) =>
        set((state) => ({
          goals: [
            ...state.goals,
            {
              ...input,
              id: crypto.randomUUID(),
              progress: 0
            }
          ]
        })),
      updateGoalProgress: (id, amount) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  progress: Math.min(goal.target, Math.max(0, goal.progress + amount))
                }
              : goal
          )
        })),
      addBill: (input) =>
        set((state) => ({
          bills: [
            ...state.bills,
            {
              ...input,
              id: crypto.randomUUID()
            }
          ]
        })),
      toggleBillAutopay: (id) =>
        set((state) => ({
          bills: state.bills.map((bill) =>
            bill.id === id
              ? {
                  ...bill,
                  autopay: !bill.autopay
                }
              : bill
          )
        })),
      addTask: (input) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...input,
              id: crypto.randomUUID(),
              complete: false
            }
          ]
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  complete: !task.complete
                }
              : task
          )
        })),
      setPrimaryCurrency: (currency) =>
        set((state) => ({
          settings: { ...state.settings, primaryCurrency: currency }
        })),
      updateSettings: (input) =>
        set((state) => ({
          settings: { ...state.settings, ...input }
        })),
      resetWorkspace: () =>
        set(() => ({
          ...initialState,
          settings: defaultSettings
        }))
    }),
    {
      name: 'finora.store',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
