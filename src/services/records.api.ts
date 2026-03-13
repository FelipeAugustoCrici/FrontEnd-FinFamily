import { api } from './api.service';

type SaveExpensePayload = {
  description: string;
  value: number;
  categoryName?: string;
  categoryId?: string;
  date: string;
  personId: string;
  isRecurring?: boolean;
  durationMonths?: number;
};

type SaveIncomePayload = {
  description: string;
  value: number;
  date: string;
  personId: string;
  type?: 'fixed' | 'flex';
  isRecurring?: boolean;
  durationMonths?: number;
};

export const recordsApi = {
  createExpense(data: SaveExpensePayload) {
    return api.post('/expenses', data);
  },

  updateExpense(id: string, data: SaveExpensePayload) {
    return api.put(`/expenses/${id}`, data);
  },

  createIncome(data: SaveIncomePayload) {
    return api.post('/incomes', data);
  },

  updateIncome(id: string, data: SaveIncomePayload) {
    return api.put(`/incomes/${id}`, data);
  },

  deleteRecord(type: 'expenses' | 'incomes' | 'extras' | 'salaries', id: string) {
    return api.delete(`/${type}/${id}`);
  },
};
