export type GoalType = 'savings' | 'debt' | 'purchase' | 'investment';
export type GoalStatus = 'active' | 'completed' | 'archived';

export type GoalContribution = {
  id: string;
  goalId: string;
  value: number;
  date: string;
  observation?: string;
  createdAt: string;
};

export type Goal = {
  id: string;
  description: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  deadline?: string;
  familyId?: string;
  personId?: string;
  status: GoalStatus;
  createdAt: string;
  contributions: GoalContribution[];
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
  bank?: string;
  brand?: string;
  color?: string;
  limitAmount: number;
  availableLimit: number;
  closingDay: number;
  dueDay: number;
  familyId?: string;
  ownerId?: string;
  isActive: boolean;
  createdAt: string;
};

export type GoalFormData = {
  description: string;
  type: GoalType;
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
  bank?: string;
  brand?: string;
  color?: string;
  limitAmount: string;
  closingDay: string;
  dueDay: string;
  familyId?: string;
};
