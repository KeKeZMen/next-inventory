import { OrderCard } from "@/entities/order/ui/OrderCard";
import { CreateOrderButton } from "@/features/order/CreateOrderButton/ui";
import { DeleteOrderButton } from "@/features/order/DeleteOrderButton/ui";
import { EditOrderButton } from "@/features/order/EditOrderButton/ui";
import { db } from "@/shared";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) return redirect("/login");

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (!right) return redirect("/login");

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
          <OrderCard
            isAdmin={right.orderSuccesing}
            order={order}
            key={`card-${order.id}`}
            deleteOrder={
              <DeleteOrderButton orderId={order.id} key={`del-${order.id}`} />
            }
            editOrder={
              <EditOrderButton
                isAdmin={right.orderSuccesing}
                consumables={consumables}
                order={order}
                key={`edit-${order.id}`}
              />
            }
          />
        ))}
        <CreateOrderButton
          consumables={consumables}
          isAdmin={right.orderSuccesing}
        />
      </div>
    </main>
  );
}
