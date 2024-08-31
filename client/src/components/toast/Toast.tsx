import type { FunctionComponent } from "react";
import successIcon from "../../assets/icons/faCheckCircle.svg";
import warningIcon from "../../assets/icons/faCircleExclamation.svg";
import infoIcon from "../../assets/icons/faInfoCircle.svg";
import errorIcon from "../../assets/icons/faCircleXmark.svg";

export interface ToastType {
  type: "success" | "error" | "info" | "warning" | "default" | "notification";
  message: string;
}

const Toast: FunctionComponent<ToastType> = ({ type, message }) => {
  let icon = "";
  let title = "";
  let name = "";
  let color = "";

  switch (type) {
    case "success":
      {
        (icon = successIcon),
        (title = "Success"),
        (name = "success"),
        (color = "#00DF80");
      }
      break;
    case "error":
      {
        (icon = errorIcon),
        (title = "Error"),
        (name = "error"),
        (color = "#F04248");
      }
      break;
    case "info":
      {
        (icon = infoIcon),
        (title = "Info"),
        (name = "info"),
        (color = "#1d9bf0");
      }
      break;
    case "warning":
      {
        (icon = warningIcon),
        (title = "Warning"),
        (name = "warning"),
        (color = "#FFD21E");
      }
      break;
    default: {
      (icon = "default"), (title = "Default"), (name = "default"), (color = "#fff");
    }
  }

  return (
    <div className="toast" style={{boxShadow: `3px 3px 10px ${color}`}}>
      <div className={`toast__icon-wrapper toast__icon-wrapper-${name}`}></div>
      <img className="toast__icon" src={icon} alt={`icon ${name}`} />
      <div className="toast__content">
        <h3 className="toast__title">{title}</h3>
        <p className="toast__message">{message}</p>
      </div>
      <div className="toast__progress" style={{ background: `${color}` }}></div>
    </div>
  );
};

export default Toast;
