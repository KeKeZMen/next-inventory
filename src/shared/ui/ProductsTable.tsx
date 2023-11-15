import clsx from "clsx";
import { ReactNode, FC } from "react";

type PropsType = {
  children: ReactNode;
  title: string;
  addButton?: JSX.Element;
  selects?: JSX.Element;
  withoutEdit?: boolean;
};

const tableHeadCells = [
  "ID",
  "Название",
  "Описание",
  "Инв. № 1",
  "Инв. № 2",
  "Инв. № 3",
  "Сер. номер",
  "Кол-во",
  "Ред.",
];

export const ProductsTable: FC<PropsType> = ({
  children,
  title,
  addButton,
  selects,
  withoutEdit,
}) => {
  return (
    <div className="px-5 pb-5 bg-white shadow-md rounded-md flex flex-col min-w-[300px] overflow-x-auto">
      <div className="flex justify-between items-center my-4 w-full">
        <h4 className="uppercase">{title}</h4>

        <div className="flex justify-between items-center">
          <div>
            <div className="h-6 w-6 rounded-md bg-[#ffd8d8] mr-3 hidden md:inline" />
            <p className="mr-3 hidden md:inline">
              Позиции, помеченные на удаление
            </p>
          </div>
          {selects}
          {addButton}
        </div>
      </div>

      <table
        className={clsx(
          "overflow-y-auto h-[45vh] rounded-md border-collapse grid",
          withoutEdit
            ? "grid-cols-[minmax(74px,_1fr)_repeat(2,_minmax(299px,_4fr))_repeat(4,_minmax(149px,_2fr))_minmax(100px,_1.5fr)]"
            : "grid-cols-[minmax(74px,_1fr)_repeat(2,_minmax(299px,_4fr))_repeat(4,_minmax(149px,_2fr))_minmax(100px,_1.5fr)_minmax(74px,_1fr)]"
        )}
      >
        <thead className="contents shadow-md bg-white mt-1">
          <tr className="contents">
            {tableHeadCells
              .filter((cell) => (withoutEdit ? cell !== "Ред." : cell))
              .map((cell, index) => (
                <th key={index} className="top-0 sticky p-4 bg-white z-10">
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
