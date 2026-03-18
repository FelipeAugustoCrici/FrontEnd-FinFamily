import { Navigate } from 'react-router-dom';
import { GoalsPage } from '../pages/GoalsPage';
import { BudgetsPage } from '../pages/BudgetsPage';
import type { AppRoute } from '@/routes/routes';

export const PlanningRoutes = {
  planning: {
    path: '/planning',
    element: <Navigate to="/planning/goals" replace />,
  },
  planningGoals: {
    path: '/planning/goals',
    element: <GoalsPage />,
  },
  planningBudgets: {
    path: '/planning/budgets',
    element: <BudgetsPage />,
  },
} satisfies Record<string, AppRoute>;
