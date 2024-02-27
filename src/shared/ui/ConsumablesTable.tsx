
import { FC, ReactNode } from "react";

type PropsType = {
  children: ReactNode;
  title: string;
  height: string;
  addButton?: JSX.Element;
  selects?: JSX.Element;
  withoutEdit?: boolean;
  margin?: string;
};

const tableHeadCells = ["ID", "Название", "Кол-во", "Действия"];

export const ConsumablesTable: FC<PropsType> = ({
  children,
  title,
  height,
  addButton,
  selects,
  margin,
}) => {
  return (
    <div
      className="px-5 pb-5 bg-white shadow-md rounded-md flex flex-col overflow-auto"
      style={{
        margin,
        height,
      }}
    >
      <div className="flex justify-between items-center my-4 w-full">
        <h4 className="uppercase">{title}</h4>

        <div className="flex justify-between items-center">
          {selects}
          {addButton}
        </div>
      </div>

      <table className="overflow-y-auto rounded-md border-collapse grid grid-cols-[minmax(74px,_1fr)_minmax(148px,_2fr)_minmax(106px,_1.5fr)_minmax(148px,_2fr)]">
        <thead className="contents shadow-md bg-white mt-1">
          <tr className="contents">
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
  );
};
