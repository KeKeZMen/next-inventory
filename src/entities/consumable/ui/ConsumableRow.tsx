import { FC } from "react";
import { IConsumable } from "../lib/types";

type PropsType = {
  consumable: IConsumable;
  editButton?: JSX.Element;
  deleteButton?: JSX.Element;
};

export const ConsumableRow: FC<PropsType> = ({
  consumable,
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
        {consumable.models?.map((model) => (
          <p key={model.id}>{model.name}</p>
        ))}
      </td>

      <td className="border-t-2 border-[#929292] text-center p-3">
        {consumable.count}
      </td>

      <td className="border-t-2 border-[#929292] text-center p-3">
        {editButton}
        {deleteButton}
      </td>
    </tr>
  );
};
