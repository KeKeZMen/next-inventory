import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CreateOrderButton } from "@/features/order/CreateOrderButton";
import { db } from "@/shared";
import { OrderBlock } from "@/widgets/OrderBlock";
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
      placeId: true,
      id: true,
      place: {
        select: {
          name: true,
        },
      },
      isDone: true,
      orderItems: {
        select: {
          id: true,
          count: true,
          consumable: {
            select: {
              count: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return (
    <main className="mt-1">
      <div className="flex flex-col md:grid grid-cols-2 gap-3">
        {orders.map((order) => (
          <OrderBlock order={order} key={order.id} />
        ))}
        <CreateOrderButton />
      </div>
    </main>
  );
}
