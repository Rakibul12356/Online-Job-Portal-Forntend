import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

// Event emitter system for global toast triggers
const listeners = new Set();

function emitToast(toastData) {
  listeners.forEach((listener) => listener(toastData));
}

let toastCounter = 0;

export const toast = (message, options = {}) => {
  const id = options.toastId || `toast-${++toastCounter}-${Date.now()}`;
  emitToast({
    id,
    type: options.type || 'default',
    message,
    autoClose: options.autoClose !== undefined ? options.autoClose : 3500,
    ...options,
  });
  return id;
};

toast.success = (message, options = {}) => {
  return toast(message, { ...options, type: 'success' });
};

toast.error = (message, options = {}) => {
  return toast(message, { ...options, type: 'error' });
};

toast.info = (message, options = {}) => {
  return toast(message, { ...options, type: 'info' });
};

toast.warning = (message, options = {}) => {
  return toast(message, { ...options, type: 'warning' });
};

toast.dismiss = (id) => {
  listeners.forEach((listener) => listener({ action: 'dismiss', id }));
};

const toastConfig = {
  success: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    barColor: 'bg-emerald-500',
    borderColor: 'border-emerald-200/80',
    bgColor: 'bg-white',
    titleColor: 'text-gray-900',
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-rose-500',
    barColor: 'bg-rose-500',
    borderColor: 'border-rose-200/80',
    bgColor: 'bg-white',
    titleColor: 'text-gray-900',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    barColor: 'bg-amber-500',
    borderColor: 'border-amber-200/80',
    bgColor: 'bg-white',
    titleColor: 'text-gray-900',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    barColor: 'bg-blue-500',
    borderColor: 'border-blue-200/80',
    bgColor: 'bg-white',
    titleColor: 'text-gray-900',
  },
  default: {
    icon: Info,
    iconColor: 'text-slate-700',
    barColor: 'bg-slate-800',
    borderColor: 'border-gray-200',
    bgColor: 'bg-white',
    titleColor: 'text-gray-900',
  },
};

function ToastItem({ toastItem, onRemove }) {
  const [isClosing, setIsClosing] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  const duration = toastItem.autoClose || 3500;
  const config = toastConfig[toastItem.type] || toastConfig.default;
  const Icon = config.icon;

  useEffect(() => {
    if (duration === false || duration <= 0) return;

    const intervalTime = 20;
    const step = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            setIsClosing(true);
            setTimeout(() => onRemove(toastItem.id), 250);
            return 0;
          }
          return prev - step;
        });
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [duration, isPaused, toastItem.id, onRemove]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onRemove(toastItem.id), 250);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative overflow-hidden rounded-xl border ${config.borderColor} ${config.bgColor} p-4 shadow-xl backdrop-blur-md transition-all duration-300 pointer-events-auto ${
        isClosing
          ? 'opacity-0 scale-95 translate-x-12'
          : 'animate-slide-in opacity-100 scale-100 translate-x-0'
      }`}
      style={{ minWidth: '320px', maxWidth: '420px' }}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 pt-0.5">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="flex-1 text-sm font-medium leading-5 text-gray-800 break-words">
          {toastItem.message}
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="shrink-0 -mr-1 -mt-1 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* React-Toastify Progress Bar */}
      {duration !== false && duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100/80">
          <div
            className={`h-full ${config.barColor} transition-all ease-linear`}
            style={{ width: `${progress}%`, transitionDuration: '20ms' }}
          />
        </div>
      )}
    </div>
  );
}

export function ToastContainer({ position = 'top-right' }) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleEvent = (event) => {
      if (event.action === 'dismiss') {
        if (event.id) {
          setToasts((prev) => prev.filter((t) => t.id !== event.id));
        } else {
          setToasts([]);
        }
      } else {
        setToasts((prev) => [event, ...prev.filter((t) => t.id !== event.id)]);
      }
    };

    listeners.add(handleEvent);
    return () => listeners.delete(handleEvent);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (toasts.length === 0) return null;

  const positionClasses = {
    'top-right': 'top-5 right-5',
    'top-left': 'top-5 left-5',
    'bottom-right': 'bottom-5 right-5',
    'bottom-left': 'bottom-5 left-5',
    'top-center': 'top-5 left-1/2 -translate-x-1/2',
  }[position] || 'top-5 right-5';

  return (
    <div className={`fixed ${positionClasses} z-[99999] flex flex-col gap-3 pointer-events-none px-4 sm:px-0`}>
      {toasts.map((item) => (
        <ToastItem key={item.id} toastItem={item} onRemove={removeToast} />
      ))}
    </div>
  );
}

export default toast;
