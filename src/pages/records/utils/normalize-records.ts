import type { UnifiedRecord } from '../types/record.types';

export function normalizeRecords(expenses: any[], incomes: any[], extras: any[]): UnifiedRecord[] {
  return [
    ...extras.map((e) => ({
      ...e,
      type: 'income',
      originalType: 'extra',
    })),
    ...incomes.map((i) => ({
      ...i,
      type: 'income',
      originalType: 'income',
    })),
    ...expenses.map((e) => ({
      ...e,
      type: 'expense',
      originalType: 'expense',
    })),
  ];
}
