import type { FunctionComponent, PropsWithChildren } from 'react';

interface ButtonProps extends PropsWithChildren<{
    onClick?: () => void;
    type: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
}> {}

const Button: FunctionComponent<ButtonProps> = (props) => {
  return (
    <button
      onClick={props.onClick}
      type={props.type}
      className={`btn ${props.className}`}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
