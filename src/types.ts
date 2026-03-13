export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

export interface Family {
  id: string;
  name: string;
  members: Person[];
}

export interface Person {
  id: string;
  name: string;
  familyId: string;
}

export interface Salary {
  id?: string;
  personId: string;
  value: number;
  month: number;
  year: number;
}

export interface Income {
  id?: string;
  description: string;
  value: number;
  date: string;
  month?: number;
  year?: number;
  type: 'fixed' | 'flex' | 'temporary';
  personId: string;
  sourceId?: string;
}

export interface IncomeSource {
  id: string;
  description: string;
  value: number;
  type: 'fixed' | 'flex' | 'temporary';
  isRecurring: boolean;
  startDate: string;
  endDate?: string;
  active: boolean;
  personId: string;
}

export interface ExtraIncome {
  id?: string;
  description: string;
  value: number;
  date: string;
  personId: string;
  month?: number;
  year?: number;
}

export interface Expense {
  id?: string;
  description: string;
  value: number;
  categoryName: string;
  categoryId?: string;
  category?: Category;
  type: 'fixed' | 'variable';
  date: string;
  personId: string;
  isCreditCard?: boolean;
  creditCardId?: string;
  isRecurring?: boolean;
  durationMonths?: number;
  recurringId?: string;
}

export interface Goal {
  id?: string;
  description: string;
  targetValue: number;
  currentValue: number;
  deadline?: string;
}

export interface Budget {
  id?: string;
  categoryName: string;
  categoryId?: string;
  category?: Category;
  limitValue: number;
  month: number;
  year: number;
}

export interface CreditCard {
  id?: string;
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
}

export interface Summary {
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
  perPerson: {
    id: string;
    name: string;
    income: number;
    expenses: number;
    contributionPercent: number;
    proportionalExpense: number;
  }[];
  healthScore: number;
  forecast: {
    estimatedNextMonthExpenses: number;
  };
  budgetAlerts: {
    category: string;
    limit: number;
    spent: number;
    percent: number;
    alert: boolean;
  }[];
  aiReport: string;
  details: {
    salaries: Salary[];
    extras: ExtraIncome[];
    incomes: Income[];
    expenses: Expense[];
  };
}
