export type Goal = {
  id: string;
  description: string;
  targetValue: number;
  currentValue: number;
  deadline?: string;
  familyId: string;
  createdAt: string;
};

export type Budget = {
  id: string;
  categoryId: string;
  categoryName: string;
  limitValue: number;
  month: number;
  year: number;
  familyId: string;
  createdAt: string;
  category?: {
    id: string;
    name: string;
    type: string;
  };
};

export type CreditCard = {
  id: string;
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  familyId: string;
  createdAt: string;
};

export type GoalFormData = {
  description: string;
  targetValue: string;
  deadline?: string;
  familyId: string;
};

export type BudgetFormData = {
  categoryId: string;
  categoryName: string;
  limitValue: string;
  month: string;
  year: string;
  familyId: string;
};

export type CreditCardFormData = {
  name: string;
  limit: string;
  closingDay: string;
  dueDay: string;
  familyId: string;
};
