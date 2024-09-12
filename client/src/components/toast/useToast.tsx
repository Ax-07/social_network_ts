import{ useCallback, useContext } from 'react';
import { ToastType } from './Toast';
import { PushToastContext, ToastsContext } from './ToastContext';

export const usePushToast = () => {
    const pushToastRef = useContext(PushToastContext);
    return useCallback(
      (toast: ToastType) => {
        pushToastRef.current(toast);
      },
      [pushToastRef]
    );
  };
  
  export const useToasts = () => useContext(ToastsContext);