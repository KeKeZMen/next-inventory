"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/shared";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const createOrder = async (state: any, formData: FormData) => {
  try {
    const session = await getServerSession(authOptions);
    const right = await db.right.findFirst({
      where: {
        id: session?.user?.rightId,
      },
    });
    if (!session?.user && !right?.consumablesActions) {
      throw new Error("Нет доступа");
    }

    const placeId = Number(formData.get("placeId") as string);
    const isDone = Boolean(formData.get("isDone"));
    const consumables = JSON.parse(
      formData.get("consumables")!.toString()
    ) as Array<{ id: number; count: number }>;

    const order = await db.order.create({
      data: {
        placeId,
        isDone: right?.orderSuccesing ? isDone : false,
      },
    });

    await db.orderItem.createMany({
      data: [
        ...consumables.map((c) => ({
          consumableId: c.id,
          orderId: order.id,
          count: c.count,
        })),
      ],
    });

    if(order.isDone) {
      for (let i = 0; i < consumables.length; i++) {
        const сonsumable = await db.consumable.findFirst({
          where: {
            id: consumables[i].id
          }
        })
        if (!сonsumable) throw new Error("Такого картриджа не существует!");
        if (сonsumable?.count - consumables[i].count < 0)
          throw new Error("Невозможно подтвердить из-за нехватки количества позиций");

        await db.consumable.update({
          where: {
            id: consumables[i].id
          },
          data: {
            count: {
              decrement: consumables[i].count
            }
          }
        })
      }
    }

    revalidatePath("/orders", "page");

    return { data: { message: "Успешно создано!" } };
  } catch (error) {
    return { error: { message: String(error) } };
  }
};
