import clsx from "clsx";
import { Children, FC, ReactNode } from "react";

type PropsType = {
  title: string;
  children: ReactNode;
  margin?: string;
  addAction?: JSX.Element;
  maxHeight?: boolean;
};

export const DataTable: FC<PropsType> = ({
  children,
  title,
  addAction,
  margin,
  maxHeight,
}) => {
  return (
    <div
      className={clsx(
        "p-3 flex items-start bg-white shadow-md rounded-md flex-col",
        !maxHeight && "md:h-[200px]"
      )}
      style={{
        margin,
      }}
    >
      <div className="flex justify-between items-center mb-[10px] w-full">
        <h3>
          {title}: {Children.count(children)}
        </h3>
        {addAction}
      </div>
      <table className="grid grid-cols-2 border-collapse rounded-md md:overflow-y-auto w-full md:max-h-[72vh]">
        <tbody className="data-table">{children}</tbody>
      </table>
    </div>
  );
};
