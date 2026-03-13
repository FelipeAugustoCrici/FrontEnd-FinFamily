import { PlanningList } from '../PlanningList';
import type { AppRoute } from '@/routes/routes';

export const PlanningRoutes = {
  planningList: {
    path: '/planning',
    element: <PlanningList />,
  },
} satisfies Record<string, AppRoute>;
