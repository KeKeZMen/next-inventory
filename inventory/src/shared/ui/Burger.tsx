import { ButtonHTMLAttributes, FC } from "react";

interface PropsType extends ButtonHTMLAttributes<HTMLButtonElement> {
  margin?: string;
}

export const BurgerButton: FC<PropsType> = ({ margin, ...buttonProps }) => {
  return (
    <button
      className="bg-none border-none outline-none flex justify-between items-center flex-col cursor-pointer w-5 h-5"
      {...buttonProps}
      style={{
        margin,
      }}
    >
      <span className="h-[3px] w-[30px] bg-white block rounded-sm mb-[5px]"></span>
      <span className="h-[3px] w-[30px] bg-white block rounded-sm mb-[5px]"></span>
      <span className="h-[3px] w-[30px] bg-white block rounded-sm "></span>
    </button>
  );
};
