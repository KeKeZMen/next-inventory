import { IType } from "../lib/types";
import { FC } from "react";

type PropsType = {
  deleteButton?: JSX.Element;
  editButton?: JSX.Element;
  type: IType;
  productsCount?: number;
};

export const TypeRow: FC<PropsType> = ({
  deleteButton,
  editButton,
  type,
  productsCount,
}) => {
  return (
    <div className="flex justify-between items-center w-full border-b-2 border-[#a9a9a9] py-3">
      <h5>{type.name}</h5>
      <div className="flex justify-between gap-3 items-center">
        {editButton}
        {deleteButton}
        {productsCount}
      </div>
    </div>
  );
};
