import { FC } from "react";
import { IOrderItem } from "../lib/types";

type PropsType = {
  orderItem: IOrderItem;
  itemsCountButton?: JSX.Element;
  deleteFormOrderButton?: JSX.Element;
};

export const OrderItemRow: FC<PropsType> = ({
  orderItem,
  itemsCountButton,
  deleteFormOrderButton,
}) => {
  return (
    <tr className="h-[43px]">
      <td className="border-t-2 border-[#929292] text-center p-3">
        {orderItem.consumable.name}
      </td>
      <td className="border-t-2 border-[#929292] text-center p-3">
        {itemsCountButton}
      </td>
    </tr>
  );
};
