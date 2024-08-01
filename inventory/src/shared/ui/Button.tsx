import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  secondary?: boolean;
  danger?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  type = "button",
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clsx(
        `flex justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 text-white`,
        disabled && "opacity-50 cursor-default",
        fullWidth && "w-full",
        danger && "bg-error focus-visible:outline-error",
        !secondary && !danger && "bg-primary hover:bg-light-primary focus-visible:outline-light-primary"
      )}
    >
      {children}
    </button>
  );
};
