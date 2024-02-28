import { IRight } from "../lib/types";
import { FC } from "react";

type PropsType = {
  deleteButton: JSX.Element;
  editButton: JSX.Element;
  right: IRight;
};

export const RightRow: FC<PropsType> = ({
  deleteButton,
  editButton,
  right,
}) => {
  return (
    <div className="flex justify-between items-center w-full border-b-2 border-[#a9a9a9] py-3">
      <h5>{right.name}</h5>
      <div className="flex justify-between gap-3 items-center">
        {editButton}
        {deleteButton}
      </div>
    </div>
  );
};
