import { Toaster as ToastProvider } from 'react-hot-toast';

export function Toaster() {
  return (
    <ToastProvider
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        style: {
          background: 'rgb(var(--background))',
          color: 'rgb(var(--foreground))',
          border: '1px solid rgb(var(--border))',
        },
        duration: 5000,
      }}
    />
  );
}
