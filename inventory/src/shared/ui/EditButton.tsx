import { ButtonHTMLAttributes, FC } from "react";

interface PropsType extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const EditButton: FC<PropsType> = ({ ...buttonProps }) => {
  return (
    <button
      className="bg-inherit w-6 h-6 border-none outline-none cursor-pointer bg-no-repeat bg-center"
      style={{
        backgroundImage: "url('/edit.svg')",
      }}
      {...buttonProps}
    />
  );
};
