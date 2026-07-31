"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ToastVariant =
  | "success"
  | "error"
  | "warning"
  | "info";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ShowToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  showToast: (input: ShowToastInput) => void;
};

const ToastContext =
  createContext<ToastContextValue | null>(null);

type ToastProviderProps = {
  children: ReactNode;
};

export default function ToastProvider({
  children,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const showToast = useCallback(
    ({
      title,
      description,
      variant = "info",
    }: ShowToastInput) => {
      const id = crypto.randomUUID();

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id,
          title,
          description,
          variant,
        },
      ]);

      window.setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast],
  );

  const contextValue = useMemo(
    () => ({
      showToast,
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div
        className="nr-toast-viewport"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <article
            key={toast.id}
            className={`nr-toast nr-toast--${toast.variant}`}
          >
            <div className="nr-toast-copy">
              <strong>{toast.title}</strong>

              {toast.description ? (
                <p>{toast.description}</p>
              ) : null}
            </div>

            <button
              type="button"
              className="nr-toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="إغلاق الإشعار"
            >
              ×
            </button>
          </article>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider.",
    );
  }

  return context;
}