import { FC } from "react";
import type { Model } from "@prisma/client";

type PropsType = {
  model: Model;
  deleteButton?: JSX.Element;
  editButton?: JSX.Element;
};

export const ModelRow: FC<PropsType> = ({
  deleteButton,
  editButton,
  model,
}) => {
  return (
    <div className="flex justify-between items-center w-full border-b-2 border-[#a9a9a9] py-3">
      <h5>{model.name}</h5>
      <div className="flex justify-between gap-3">
        {editButton}
        {deleteButton}
      </div>
    </div>
  );
};
