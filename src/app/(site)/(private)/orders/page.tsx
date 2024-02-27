import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
  });

  return <div>page</div>;
}
