import { ConsumableRow } from "@/entities/consumable/ui/ConsumableRow";
import { OrderItemRow } from "@/entities/orderItem/ui/OrderItemRow";
import { DeleteOrderButton } from "@/features/order/DeleteOrderButton";
import { EditOrderButton } from "@/features/order/EditOrderButton";
import { AddToOrderButton } from "@/features/orderItem/AddToOrderButton";
import { CountEdit } from "@/features/orderItem/CountEdit";
import { DeleteFromOrderButton } from "@/features/orderItem/DeleteFromOrderButton";
import { DataTable, db } from "@/shared";
import clsx from "clsx";
import React from "react";

type PropsType = {
  order: {
    place: {
      name: string;
    };
    placeId: number;
    id: number;
    isDone: boolean;
    orderItems: {
      count: number;
      consumable: {
        count: number;
        name: string;
      };
      id: number;
    }[];
  };
};

export const OrderBlock = async ({ order }: PropsType) => {
  const consumables = await db.consumable.findMany();

  return (
    <div
      className={clsx(
        "flex justify-between flex-col border-2 rounded-md p-3 border-[#929292] gap-3",
        order.isDone && "border-[#59CB4F] bg-[#DBFFD8]"
      )}
    >
      <p className="text-center">В {order.place.name}</p>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="md:w-[50%] overflow-hidden">
          <DataTable height="300px" title="Выбранные для заказа">
            {order.orderItems.map((orderItem) => (
              <OrderItemRow
                key={orderItem.id}
                orderItem={orderItem}
                deleteFormOrderButton={
                  <DeleteFromOrderButton orderItemId={orderItem.id} />
                }
                itemsCountButton={
                  <CountEdit
                    maxCount={orderItem.consumable.count}
                    orderItem={orderItem}
                    key={orderItem.id}
                  />
                }
              />
            ))}
          </DataTable>
        </div>
        <div className="md:w-[50%]">
          <DataTable title="Имеющиеся в наличии" height="300px">
            {consumables.map((consumable) => (
              <ConsumableRow
                consumable={consumable}
                isOrdering
                key={consumable.id}
                addToOrderButton={
                  <AddToOrderButton
                    orderId={order.id}
                    consumableId={consumable.id}
                  />
                }
              />
            ))}
          </DataTable>
        </div>
      </div>
      <div className="flex gap-3 items-center justify-center">
        <EditOrderButton order={order} />
        <DeleteOrderButton orderId={order.id} />
      </div>
    </div>
  );
};
