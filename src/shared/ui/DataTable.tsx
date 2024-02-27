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
}) => {
  return (
    <div
      className="p-3 flex items-start bg-white shadow-md rounded-md flex-col overflow-hidden h-[calc(100%-24px)]"
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

      <table
        className={`grid grid-cols-2 border-collapse rounded-md overflow-y-auto w-full h-[calc(100%-24px)]`}
      >
        <tbody className="data-table">{children}</tbody>
      </table>
    </div>
  );
};
