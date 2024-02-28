import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { OrderCard } from "@/entities/order/ui/OrderCard";
import { CreateOrderButton } from "@/features/order/CreateOrderButton";
import { DeleteOrderButton } from "@/features/order/DeleteOrderButton";
import { EditOrderButton } from "@/features/order/EditOrderButton";
import { db } from "@/shared";
import { getServerSession } from "next-auth";
import React from "react";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  const orders = await db.order.findMany({
    where: {
      place: {
        userPlace: {
          some: {
            userId: session?.user?.id,
          },
        },
      },
    },
    select: {
      createdAt: true,
      isDone: true,
      id: true,
      placeId: true,
      place: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  return (
    <main className="mt-1">
      <div className="flex flex-wrap gap-3">
        {orders.map((order) => (
          <OrderCard
            order={order}
            deleteOrder={<DeleteOrderButton orderId={order.id} />}
            editOrder={<EditOrderButton order={order} />}
            key={order.id}
          />
        ))}
        <CreateOrderButton />
      </div>
    </main>
  );
}
