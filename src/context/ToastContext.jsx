import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message) => addToast(message, 'error'), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, addToast, removeToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all duration-300 animate-slide-in ${
              toast.type === 'success'
                ? 'border-emerald-100 bg-emerald-50/90 text-emerald-900 shadow-emerald-100/50'
                : 'border-rose-100 bg-rose-50/90 text-rose-900 shadow-rose-100/50'
            }`}
            role="alert"
          >
            {toast.type === 'success' ? (
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0 text-rose-600" />
            )}
            
            <div className="flex-1 text-sm font-medium leading-5">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className={`shrink-0 rounded-lg p-0.5 transition-colors ${
                toast.type === 'success'
                  ? 'text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700'
                  : 'text-rose-500 hover:bg-rose-100 hover:text-rose-700'
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
