"use client";

import { FC } from "react";
import { IOrder } from "../lib/types";
import clsx from "clsx";

type PropsType = {
  order: IOrder;
  editOrder?: JSX.Element;
  deleteOrder?: JSX.Element;
};

export const OrderCard: FC<PropsType> = ({ order, editOrder, deleteOrder }) => {
  return (
    <div
      className={clsx(
        "flex flex-col shadow-md rounded-md p-3 w-[200px]",
        order.isDone && "border-[#59CB4F] bg-[#DBFFD8]"
      )}
    >
      <div className="flex flex-col gap-2">
        <p className="text-2xl uppercase">В {order.place?.name}</p>
        <p>Создан {order.createdAt.getDate()}</p>
      </div>
      <div className="flex justify-end items-center">
        {editOrder}
        {deleteOrder}
      </div>
    </div>
  );
};
