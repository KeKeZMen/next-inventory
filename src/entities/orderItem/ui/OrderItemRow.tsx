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
    <div className="flex justify-between items-center w-full border-b-2 border-[#a9a9a9] py-3">
      <h5>{orderItem.consumable?.name}</h5>
      <div className="flex justify-between gap-3 items-center">
        {itemsCountButton}
        {deleteFormOrderButton}
      </div>
    </div>
  );
};
