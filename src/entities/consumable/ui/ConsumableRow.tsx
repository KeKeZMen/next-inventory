import { FC } from "react";
import { IConsumable } from "../lib/types";

type PropsType = {
  consumable: IConsumable;
  addToOrderButton?: JSX.Element;
  editButton?: JSX.Element;
  deleteButton?: JSX.Element;
  isOrdering?: boolean;
};

export const ConsumableRow: FC<PropsType> = ({
  consumable,
  isOrdering,
  addToOrderButton,
  deleteButton,
  editButton,
}) => {
  return (
    <tr className="h-[43px]">
      {!isOrdering && (
        <td className=" text-center p-3">
          {consumable.id}
        </td>
      )}
      <td className=" text-center p-3">
        {consumable.name}
      </td>
      {!isOrdering && (
        <td className="text-center p-3">
          {consumable.count}
        </td>
      )}
      <td className=" text-center p-3">
        {editButton}
        {deleteButton}
        {addToOrderButton}
      </td>
    </tr>
  );
};
