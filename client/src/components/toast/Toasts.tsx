import { useContext } from "react";
import Toast from "./Toast";
import { ToastsContext } from "./ToastContext";

export const Toasts = () => {
  const toasts = useContext(ToastsContext);
  return (
    <div className="toasts">
      {toasts.map((toast, index) => (
        <Toast key={index} {...toast} />
      ))}
    </div>
  );
};