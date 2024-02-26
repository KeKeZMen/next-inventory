import { FC } from "react";
import { IConsumable } from "../lib/types";

type PropsType = {
  consumable: IConsumable;
  addToOrderButton?: JSX.Element;
  editButton?: JSX.Element;
  deleteButton?: JSX.Element;
};

export const ConsumableRow: FC<PropsType> = ({ consumable }) => {
  return (
    <tr className="h-[43px]">
      <td className="border-t-2 border-[#929292] text-center p-3">
        {consumable.name}
      </td>
    </tr>
  );
};
