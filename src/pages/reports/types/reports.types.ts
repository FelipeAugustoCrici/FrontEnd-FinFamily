export type SummaryData = {
  month: number;
  year: number;
  familyId: string;
  totals: {
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
  comparison: {
    incomeChange: number;
    expenseChange: number;
  };
  perPerson: Array<{
    id: string;
    name: string;
    income: number;
    expenses: number;
    contributionPercent: number;
    proportionalExpense: number;
  }>;
  healthScore: number;
  forecast: {
    estimatedNextMonthExpenses: number;
  };
  budgetAlerts: Array<{
    category: {
      id: string;
      name: string;
    };
    limit: number;
    spent: number;
    percent: number;
    alert: boolean;
  }>;
  aiReport: {
    summary: string;
    insights: string[];
    recommendations: string[];
  };
  details: {
    salaries: any[];
    extras: any[];
    incomes: any[];
    expenses: any[];
  };
};

export type MonthlyData = {
  month: string;
  income: number;
  expense: number;
  balance: number;
};

export type CategoryExpense = {
  name: string;
  value: number;
  percentage: number;
  color: string;
};

export type PersonExpense = {
  id: string;
  name: string;
  total: number;
  percentage: number;
};

export type RecurringExpense = {
  id: string;
  description: string;
  value: number;
  dueDay?: number;
  status: 'paid' | 'pending';
};
