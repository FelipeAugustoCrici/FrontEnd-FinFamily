import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ApplicationRoutes } from '@/routes';
import { ToastProvider } from '@/hooks/useToast';
import { Toaster } from '@/components/ui/Toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <ApplicationRoutes />
        <Toaster />
      </QueryClientProvider>
    </ToastProvider>
  );
}

export default App;
