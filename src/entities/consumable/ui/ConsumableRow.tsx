import { FC } from "react";
import { IConsumable } from "../lib/types";

type PropsType = {
  consumable: IConsumable;
  addToOrderButton?: JSX.Element;
  editButton?: JSX.Element;
  deleteButton?: JSX.Element;
};

export const ConsumableRow: FC<PropsType> = ({
  consumable,
  addToOrderButton,
  deleteButton,
  editButton,
}) => {
  return (
    <tr className="h-[43px]">
      <td className="border-t-2 border-[#929292] text-center p-3">
        {consumable.id}
      </td>
      <td className="border-t-2 border-[#929292] text-center p-3">
        {consumable.name}
      </td>
      <td className="border-t-2 border-[#929292] text-center p-3">
        {consumable.count}
      </td>
      <td className="border-t-2 border-[#929292] text-center p-3">
        {editButton}
        {deleteButton}
        {addToOrderButton}
      </td>
    </tr>
  );
};
