import React from 'react';
import { toast, ToastContainer } from '@/utils/toast';

export { toast, ToastContainer };

export function ToastProvider({ children }) {
  return (
    <>
      {children}
      <ToastContainer position="top-right" />
    </>
  );
}

export function useToast() {
  return {
    toast,
    success: (msg, opts) => toast.success(msg, opts),
    error: (msg, opts) => toast.error(msg, opts),
    info: (msg, opts) => toast.info(msg, opts),
    warning: (msg, opts) => toast.warning(msg, opts),
    dismiss: (id) => toast.dismiss(id),
  };
}

export default useToast;
