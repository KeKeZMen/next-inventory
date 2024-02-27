import clsx from "clsx";
import { Children, FC, ReactNode } from "react";

type PropsType = {
  title: string;
  children: ReactNode;
  height: string;
  margin?: string;
  addAction?: JSX.Element;
};

export const DataTable: FC<PropsType> = ({
  children,
  title,
  addAction,
  margin,
  height,
}) => {
  return (
    <div
      className={clsx(
        "p-3 flex items-start bg-white shadow-md rounded-md flex-col",
        `h-[${height}]`
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

      <table className={`grid grid-cols-2 border-collapse rounded-md overflow-y-auto w-full max-h-[${height}]`}>
        <tbody className="data-table">{children}</tbody>
      </table>
    </div>
  );
};
