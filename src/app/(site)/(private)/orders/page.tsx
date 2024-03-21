import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CreateOrderButton } from "@/features/order/CreateOrderButton/ui";
import { db } from "@/shared";
import { Order } from "@/widgets/Order";
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
          name: true,
        },
      },
      orderItems: {
        select: {
          consumable: {
            select: {
              id: true,
              name: true,
              count: true,
            },
          },
          count: true,
          id: true,
        },
      },
    },
  });

  const consumables = await db.consumable.findMany();

  return (
    <main className="mt-1">
      <div className="flex flex-wrap gap-3">
        {orders.map((order) => (
          <Order order={order} consumables={consumables} key={order.id} />
        ))}
        <CreateOrderButton consumables={consumables} />
      </div>
    </main>
  );
}
