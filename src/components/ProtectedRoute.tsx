import { Navigate } from 'react-router-dom';
import { JSX, useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const session = await fetchAuthSession();
        console.log(session);
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
    return <div>Carregando...</div>;
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
