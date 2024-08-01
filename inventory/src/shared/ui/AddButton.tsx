import { ButtonHTMLAttributes, FC } from "react";

interface PropsType extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const AddButton: FC<PropsType> = ({ ...buttonProps }) => {
  return (
    <button
      {...buttonProps}
      className="bg-inherit w-6 h-6 border-none outline-none cursor-pointer bg-no-repeat bg-center"
      style={{ backgroundImage: "url('/add.svg')" }}
    />
  );
};
