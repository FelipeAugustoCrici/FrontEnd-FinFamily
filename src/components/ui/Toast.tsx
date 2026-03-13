import * as ToastPrimitive from '@radix-ui/react-toast';
import { cn } from '@/lib/utils';

export const ToastProvider = ToastPrimitive.Provider;

export const ToastRoot = ({ className, ...props }: ToastPrimitive.ToastProps) => (
  <ToastPrimitive.Root
    className={cn(
      'relative flex w-full max-w-sm items-start gap-4 overflow-hidden rounded-xl border border-primary-100 bg-white p-4 shadow-lg animate-in slide-in-from-top fade-in',
      className,
    )}
    {...props}
  />
);

export const ToastTitle = ({ className, ...props }: ToastPrimitive.ToastTitleProps) => (
  <ToastPrimitive.Title
    className={cn('text-sm font-semibold text-primary-800', className)}
    {...props}
  />
);

export const ToastDescription = ({ className, ...props }: ToastPrimitive.ToastDescriptionProps) => (
  <ToastPrimitive.Description className={cn('text-sm text-primary-500', className)} {...props} />
);

export const ToastClose = ToastPrimitive.Close;

export const ToastViewport = ({ className, ...props }: ToastPrimitive.ToastViewportProps) => (
  <ToastPrimitive.Viewport
    className={cn(
      'fixed top-4 right-4 z-50 flex max-h-screen w-full max-w-sm flex-col gap-3 outline-none',
      className,
    )}
    {...props}
  />
);
