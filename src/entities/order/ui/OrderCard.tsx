"use client";

import { FC } from "react";
import { IOrderWithOrderItemsAndPlace } from "@/shared/lib/typecode";
import clsx from "clsx";

type PropsType = {
  order: IOrderWithOrderItemsAndPlace;
  editOrder?: JSX.Element;
  deleteOrder?: JSX.Element;
  isAdmin?: boolean;
};

export const OrderCard: FC<PropsType> = ({
  order,
  editOrder,
  deleteOrder,
  isAdmin,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col shadow-md rounded-md p-3 w-full md:w-[200px]",
        order.isDone && "border-[#59CB4F] bg-[#DBFFD8]"
      )}
    >
      <div className="flex flex-col gap-2">
        <p className="text-2xl uppercase">В {order.place?.name}</p>
        <p>
          Создан {order.createdAt.getDate()}.{order.createdAt.getMonth()}.
          {order.createdAt.getFullYear()}
        </p>
      </div>
      <div className="flex justify-end items-center">
        {editOrder}
        {isAdmin && deleteOrder}
      </div>
    </div>
  );
};
