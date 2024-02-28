import { Children, FC, ReactNode } from "react";

type PropsType = {
  title: string;
  children: ReactNode;
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
      className="p-3 flex items-start bg-white shadow-md rounded-md flex-col h-full w-full overflow-y-auto"
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

      <div className="overflow-y-auto w-full flex flex-col">{children}</div>
    </div>
  );
};
