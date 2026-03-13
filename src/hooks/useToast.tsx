import * as React from 'react';
import { v4 as uuid } from 'uuid';

type ToastVariant = 'success' | 'error';

type Toast = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

const ToastContext = React.createContext<{
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  function showToast(toast: Omit<Toast, 'id'>) {
    setToasts((prev) => [...prev, { ...toast, id: uuid() }]);

    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 4000);
  }

  return <ToastContext.Provider value={{ toasts, showToast }}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}
