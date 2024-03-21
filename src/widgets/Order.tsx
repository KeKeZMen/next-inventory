import { OrderCard } from "@/entities/order/ui/OrderCard";
import { DeleteOrderButton } from "@/features/order/DeleteOrderButton/ui";
import { EditOrderButton } from "@/features/order/EditOrderButton/ui";
import { FC } from "react";

type PropsType = {
  order: {
    isDone: boolean;
    place: {
      name: string;
      id: number;
    };
    id: number;
    placeId: number;
    createdAt: Date;
    orderItems: {
      count: number;
      consumable: {
        name: string;
        count: number;
        id: number;
      };
      id: number;
    }[];
  };
  consumables: {
    id: number;
    name: string;
    required: boolean;
    count: number;
  }[];
};

export const Order: FC<PropsType> = ({ order, consumables }) => {
  return (
    <OrderCard
      order={order}
      deleteOrder={<DeleteOrderButton orderId={order.id} />}
      editOrder={<EditOrderButton consumables={consumables} order={order} />}
    />
  );
};
