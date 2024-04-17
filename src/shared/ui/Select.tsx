import React, { FC, ReactNode, SelectHTMLAttributes } from "react";

interface PropsType extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export const Select: FC<PropsType> = (props) => {
  return (
    <div className="select__div">
      <select {...props} className="select">
        {props.children}
      </select>
    </div>
  );
};
