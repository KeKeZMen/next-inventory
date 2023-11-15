import clsx from "clsx";
import { ButtonHTMLAttributes, FC } from "react";

interface PropsType extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const DeleteButton: FC<PropsType> = ({ ...buttonProps }) => {
  return (
    <button
      className={clsx(
        "bg-inherit w-6 h-6 border-none outline-none cursor-pointer bg-no-repeat bg-center",
        buttonProps.className
      )}
      style={{
        backgroundImage: "url('/delete.svg')",
      }}
      {...buttonProps}
    />
  );
};
