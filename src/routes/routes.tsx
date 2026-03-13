import { RouteProps } from 'react-router-dom';

import { Dashboard } from '@/pages/dashboard';
import { Login, NewPassword, ForgotPassword, Register, ConfirmSignUp } from '@/pages/auth';
import { FamilyRoutes } from '@/pages/families/base/FamilyRoutes';
import { RecordRoutes } from '@/pages/records/base/RecordRoutes';
import { CategoryRoutes } from '@/pages/categories/base/CategoryRoutes';
import { PlanningRoutes } from '@/pages/planning';
import { Profile } from '@/pages/profile';
import { ReportsRoutes } from '@/pages/reports/base/ReportsRoutes';

export type AppRoute = RouteProps & {
  isPublic?: boolean;
  use?: string;
};

export const PublicRoutes = {
  login: {
    path: '/login',
    element: <Login />,
    isPublic: true,
  },
  newPassword: {
    path: '/nova-senha',
    element: <NewPassword />,
    isPublic: true,
  },
  forgotPassword: {
    path: '/esqueci-senha',
    element: <ForgotPassword />,
    isPublic: true,
  },
  register: {
    path: '/cadastro',
    element: <Register />,
    isPublic: true,
  },
  confirmSignUp: {
    path: '/confirmar-cadastro',
    element: <ConfirmSignUp />,
    isPublic: true,
  },
} satisfies Record<string, AppRoute>;

export const PrivateRoutes = {
  home: {
    path: '/',
    element: <Dashboard />,
  },
  dashboard: {
    path: '/dashboard',
    element: <Dashboard />,
  },
  ...RecordRoutes,
  ...FamilyRoutes,
  ...CategoryRoutes,
  ...ReportsRoutes,
  ...PlanningRoutes,
  profile: {
    path: '/perfil',
    element: <Profile />,
  },
} satisfies Record<string, AppRoute>;

export const ROUTES = {
  ...PublicRoutes,
  ...PrivateRoutes,
} satisfies Record<string, AppRoute>;

export const publicRoutesArray = Object.keys(PublicRoutes).map(
  (key) => PublicRoutes[key as keyof typeof PublicRoutes],
) as AppRoute[];

export const privateRoutesArray = Object.keys(PrivateRoutes).map(
  (key) => PrivateRoutes[key as keyof typeof PrivateRoutes],
) as AppRoute[];
