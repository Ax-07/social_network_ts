// ToastsContext.tsx
import { createContext, PropsWithChildren, useState, useRef, useCallback } from "react";
import { ToastType } from "./Toast";
import { Toasts } from "./Toasts";

export const ToastsContext = createContext<ToastType[]>([]);
export const PushToastContext = createContext<{ current: (toast: ToastType) => void }>({ current: () => {} });

export const ToastsProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const pushToastRef = useRef<(toast: ToastType) => void>(() => {});

  // Fonction d'ajout d'un toast
  const pushToast = useCallback((toast: ToastType) => {
    setToasts((prevToasts) => [...prevToasts, toast]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t !== toast));
    }, 3000);
  }, []);

  // Mise à jour de la référence avec la fonction pushToast
  pushToastRef.current = pushToast;

  return (
    <PushToastContext.Provider value={pushToastRef}>
      <ToastsContext.Provider value={toasts}>
        <Toasts />
        {children}
      </ToastsContext.Provider>
    </PushToastContext.Provider>
  );
};
