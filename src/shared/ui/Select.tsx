import clsx from "clsx";
import React, { FC, ReactNode, SelectHTMLAttributes } from "react";

interface PropsType extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  containerPadding?: string;
  selectPadding?: string;
}

export const Select: FC<PropsType> = (props) => {
  const { containerPadding, selectPadding, ...rest } = props;
  return (
    <div
      className={clsx("select__div", props.className)}
      style={{ padding: containerPadding }}
    >
      <select {...rest} className="select" style={{ padding: selectPadding }}>
        {props.children}
      </select>
    </div>
  );
};
