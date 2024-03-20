"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/shared";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const editOrder = async (state: any, formData: FormData) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Нет доступа" };

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });
  if (!right?.consumablesActions) return { error: "Нет доступа" };  

  const consumables = JSON.parse(
    formData.get("consumables")!.toString()
  ) as Array<{ id: number; count: number }>;

  const orderId = Number(formData.get("orderId") as string);

  await db.orderItem.deleteMany({
    where: {
      orderId,
    },
  });

  await db.orderItem.createMany({
    data: [
      ...consumables.map((c) => ({
        consumableId: c.id,
        orderId,
        count: c.count,
      })),
    ],
  });

  revalidatePath("/orders")

  return { data: {} };
};

export const editOrderItemsCount = async () => {};

export const deleteOrder = async (orderId: number) => {
  const session = await getServerSession(authOptions);

  console.log(orderId);

  return revalidatePath("/");
};
