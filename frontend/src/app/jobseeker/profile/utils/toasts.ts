// utils/toast.ts
import { toast } from 'sonner';

export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
  });
};

export const showErrorToast = (message: string, description?: string) => {
  toast.error(message, {
    description,
  });
};

export const showInfoToast = (message: string, description?: string) => {
  toast.info(message, {
    description,
  });
};

export const showWarningToast = (message: string, description?: string) => {
  toast.warning(message, {
    description,
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message);
};

export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};

// Promise-based toast for async operations
export const promiseToast = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: unknown) => string);
  }
) => {
  return toast.promise(promise, messages);
};

// Action toast
export const showActionToast = (
  message: string, 
  actionLabel: string, 
  onAction: () => void,
  description?: string
) => {
  toast(message, {
    description,
    action: {
      label: actionLabel,
      onClick: onAction,
    },
  });
};
