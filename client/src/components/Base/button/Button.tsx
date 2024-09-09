import type { FunctionComponent, PropsWithChildren } from 'react';

interface ButtonProps extends PropsWithChildren<{
    onClick?: () => void;
    type: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
}> {}

const Button: FunctionComponent<ButtonProps> = (props) => {
    // Gestion de l'événement onClick pour éviter l'exécution si le bouton est désactivé
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.disabled) {
        e.preventDefault();
        return;
      }
      if (props.onClick) {
        props.onClick();
      }
    };
  return (
    <button
      onClick={handleClick}
      type={props.type}
      className={`${props.className}`}
      disabled={props.disabled}
      aria-disabled={props.disabled} // Ajout d'aria-disabled pour l'accessibilité

    >
      {props.children}
    </button>
  );
};

export default Button;
