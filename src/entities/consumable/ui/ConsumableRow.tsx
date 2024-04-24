import { IConsumableWithModels } from "@/shared/lib/typecode";
import { FC } from "react";

type PropsType = {
  consumable: IConsumableWithModels;
  editButton?: JSX.Element;
  deleteButton?: JSX.Element;
  isAdmin?: boolean;
};

export const ConsumableRow: FC<PropsType> = ({
  consumable,
  deleteButton,
  editButton,
  isAdmin,
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
      {isAdmin && (
        <td className="border-t-2 border-[#929292] text-center p-3">
          {editButton}
          {deleteButton}
        </td>
      )}
    </tr>
  );
};
