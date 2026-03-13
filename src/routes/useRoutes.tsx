import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from './routes';

export type NavigationData = {
  id?: string;
  state?: any;
};

export type DefaultRouteFunction = (navigation?: NavigationData, ignoreUnsaved?: boolean) => void;

export type RoutesNavigator = {
  [str in keyof typeof ROUTES]: DefaultRouteFunction;
};

export function useRoutes() {
  const navigate = useNavigate();

  const routes = useMemo(() => {
    const automaticRoutes: RoutesNavigator = {} as any;

    Object.keys(ROUTES).forEach((key: string) => {
      automaticRoutes[key as keyof typeof ROUTES] = (navigation) => {
        const appRoute: any = ROUTES[key as keyof typeof ROUTES];
        let route = appRoute.use || appRoute.path;

        if (navigation?.id) {
          route = route.replace(':id', navigation.id);
        }

        navigate(route, {
          state: navigation?.state,
        });
      };
    });

    return {
      ...automaticRoutes,
      goBack: (route: string, content = {}) => {
        navigate(route, {
          state: { ...content, goingBack: true },
        });
      },
      clear: () => {
        navigate({}, { state: null } as any);
      },
    };
  }, [navigate]);

  return {
    routes,
  };
}
