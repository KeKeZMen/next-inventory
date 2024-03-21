"use server";

import { db } from "@/shared";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const editOrder = async (state: any, formData: FormData) => {
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

    const orderId = Number(formData.get("orderId") as string);
    const placeId = Number(formData.get("placeId") as string);
    const isDone = Boolean(formData.get("isDone"));
    const consumables = JSON.parse(
      formData.get("consumables")!.toString()
    ) as Array<{ id: number; count: number }>;

    const oldOrder = await db.order.findFirst({
      where: {
        id: orderId,
      },
    });

    const newOrder = await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        placeId,
        isDone: right?.orderSuccesing ? isDone : oldOrder?.isDone
      },
    });

    await db.orderItem.deleteMany({
      where: {
        orderId,
      },
    });

    await db.orderItem.createMany({
      data: [
        ...consumables.map((c) => ({
          consumableId: c.id,
          orderId: newOrder.id,
          count: c.count,
        })),
      ],
    });

    // if(oldOrder?.isDone) throw new Error("Вы не можете редактировать готовый заказ")

    if (oldOrder?.isDone !== newOrder.isDone) {
      for (let i = 0; i < consumables.length; i++) {
        const сonsumable = await db.consumable.findFirst({
          where: {
            id: consumables[i].id,
          },
        });
        if (!сonsumable) throw new Error("Такого картриджа не существует!");
        if (newOrder.isDone && сonsumable?.count - consumables[i].count < 0)
          throw new Error(
            "Невозможно подтвердить из-за нехватки количества позиций"
          );

        await db.consumable.update({
          where: {
            id: consumables[i].id,
          },
          data: {
            count: newOrder.isDone
              ? { decrement: consumables[i].count }
              : { increment: consumables[i].count },
          },
        });
      }
    }

    revalidatePath("/orders", "page");

    return { data: { message: "Успешно отредактировано!" } };
  } catch (error) {
    return { error: { message: String(error) } };
  }
};
