import clsx from "clsx";
import { ReactNode, FC } from "react";

type PropsType = {
  children: ReactNode;
  title: string;
  addButton?: JSX.Element;
  selects?: JSX.Element;
  withoutEdit?: boolean;
  margin?: string;
};

const tableHeadCells = [
  "Название",
  "Описание",
  "Инв. №",
  "Кол-во",
  "Ред.",
];

export const ProductsTable: FC<PropsType> = ({
  children,
  title,
  addButton,
  selects,
  withoutEdit,
  margin,
}) => {
  return (
    <div
      className={clsx("px-5 pb-5 bg-white shadow-md rounded-md flex flex-col h-full")}
      style={{
        margin,
      }}
    >
      <div className="flex justify-between items-center my-4 w-full">
        <h4 className="uppercase">{title}</h4>

        <div className="flex justify-between items-center gap-3">
          <div className="flex">
            <div className="h-6 w-6 rounded-md bg-[#ffd8d8] mr-3 hidden md:block" />
            <p className="mr-3 hidden md:inline">
              Позиции, помеченные на удаление
            </p>
          </div>
          {selects}
          {addButton}
        </div>
      </div>

      <div className="h-full w-full overflow-y-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {tableHeadCells
                .filter((cell) => (withoutEdit ? cell !== "Ред." : cell))
                .map((cell, index) => (
                  <th key={index} className="top-0 sticky p-4 bg-white min-w-[100px]">
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
