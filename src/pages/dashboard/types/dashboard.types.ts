export type Category = {
  id: string;
  name: string;
  type: 'income' | 'expense';
  createdAt: string;
};

export type Recurring = {
  id: string;
  description: string;
  value: number;
  categoryName: string;
  personId: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Income = {
  id: string;
  description: string;
  value: number;
  date: string;
  month: number;
  year: number;
  type: 'fixed' | 'variable' | 'flex';
  personId: string;
  sourceId: string | null;
  createdAt: string;
  is_deleted: boolean;
  dt_deleted: string | null;
};

export type Expense = {
  id: string;
  description: string;
  value: number;
  categoryName: string;
  categoryId: string | null;
  type: 'fixed' | 'variable';
  date: string;
  month: number;
  year: number;
  isCreditCard: boolean;
  creditCardId: string | null;
  personId: string;
  createdAt: string;
  is_deleted: boolean;
  dt_deleted: string | null;
  recurringId: string | null;
  recurring: Recurring | null;
  category: Category | null;
};

type Totals = {
  salary: number;
  extras: number;
  incomes: number;
  expenses: number;
  balance: number;
  fixedExpenses: number;
  variableExpenses: number;
  fixedExpenseCommitment: number;
  fixedIncome: number;
  variableIncome: number;
  predictableIncomePercent: number;
};

type Comparison = {
  incomeChange: number;
  expenseChange: number;
};

type PerPerson = {
  id: string;
  name: string;
  income: number;
  expenses: number;
  contributionPercent: number;
  proportionalExpense: number;
};

type Forecast = {
  estimatedNextMonthExpenses: number;
};

type BudgetAlert = {
  category: string;
  percent: number;
  alert: boolean;
};

type Details = {
  salaries: Array<Income>;
  extras: Array<Income>;
  incomes: Array<Income>;
  expenses: Array<Expense>;
};

export type DashboardSummary = {
  month: number;
  year: number;
  familyId: string;
  totals: Totals;
  comparison: Comparison;
  perPerson: Array<PerPerson>;
  healthScore: number;
  forecast: Forecast;
  budgetAlerts: Array<BudgetAlert>;
  aiReport: string;
  details: Details;
};
