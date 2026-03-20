import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from 'react-router-dom';

import { Layout } from '@/components/Layout';
import { AuthRoutes } from './AuthRoutes';
import { publicRoutesArray, privateRoutesArray } from './routes';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {publicRoutesArray.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      <Route
        path="/*"
        element={
          <AuthRoutes>
            <Layout />
          </AuthRoutes>
        }
      >
        <Route
          index
          element={privateRoutesArray.find((r) => r.path === '/')?.element || <Navigate to="/" />}
        />

        {privateRoutesArray
          .filter((route) => route.path !== '/')
          .map((route) => (
            <Route key={route.path} path={route.path?.replace(/^\//, '')} element={route.element} />
          ))}
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Route>,
  ),
);

export default function ApplicationRoutes() {
  return <RouterProvider router={router} />;
}
