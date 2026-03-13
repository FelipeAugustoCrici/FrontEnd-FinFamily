import { Navigate, Outlet } from 'react-router-dom';
import { JSX, useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

interface AuthRoutesProps {
  children?: JSX.Element;
}

export function AuthRoutes({ children }: AuthRoutesProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const session = await fetchAuthSession();
        setAuthorized(!!session.tokens?.accessToken);
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    check();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
}
