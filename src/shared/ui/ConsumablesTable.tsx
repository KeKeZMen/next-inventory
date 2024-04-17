import { FC, ReactNode } from "react";

type PropsType = {
  children: ReactNode;
  title: string;
  addButton?: JSX.Element;
  selects?: JSX.Element;
  withoutEdit?: boolean;
  margin?: string;
};

const tableHeadCells = ["ID", "Название", "Подходит", "Кол-во", "Действия"];

export const ConsumablesTable: FC<PropsType> = ({
  children,
  title,
  addButton,
  selects,
  margin,
}) => {
  return (
    <div
      className="px-5 pb-5 bg-white shadow-md rounded-md flex flex-col h-full"
      style={{
        margin,
      }}
    >
      <div className="flex justify-between items-center my-4 w-full">
        <h4 className="uppercase">{title}</h4>

        <div className="flex justify-between items-center gap-3">
          {selects}
          {addButton}
        </div>
      </div>

      <div className="h-full w-full overflow-y-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {tableHeadCells.map((cell, index) => (
                <th key={index} className="top-0 sticky p-4 bg-white ">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
};
