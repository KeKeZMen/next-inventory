import { FC } from "react";
import { IConsumable } from "../lib/types";

type PropsType = {
  consumable: IConsumable;
  addToOrderButton?: JSX.Element;
};

export const OrderingConsumable: FC<PropsType> = ({
  consumable,
  addToOrderButton,
}) => {
  return (
    <div className="flex justify-between items-center w-full border-b-2 border-[#a9a9a9] py-3">
      <h5>{consumable.name}: {consumable.count}</h5>
      <div className="flex justify-between gap-3 items-center">
        {addToOrderButton}
      </div>
    </div>
  );
};
