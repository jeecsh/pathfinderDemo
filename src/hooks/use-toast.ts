import { create } from 'zustand';

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'destructive';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastType;
}

interface ToastStore {
  toasts: Toast[];
  add: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: Math.random().toString(36).slice(2) },
      ],
    })),
  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  dismissAll: () => set({ toasts: [] }),
}));

export const useToast = () => {
  const { add, dismiss, dismissAll } = useToastStore();

  const toast = ({
    title,
    description,
    variant = 'default',
  }: Omit<Toast, 'id'>) => {
    add({ title, description, variant });
  };

  return {
    toast,
    dismiss,
    dismissAll,
  };
};
