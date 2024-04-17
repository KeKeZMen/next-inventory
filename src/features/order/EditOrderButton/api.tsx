"use server";

import { db } from "@/shared";
import { ApiError } from "@/shared/api/ApiError";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export const editOrder = async (state: any, formData: FormData) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw ApiError.unauthorized();

    const right = await db.right.findFirst({
      where: {
        id: session?.user?.rightId,
      },
    });
    if (!right?.consumablesActions) throw ApiError.noEnoughRights();

    const orderId = Number(formData.get("orderId") as string);
    const placeId = Number(formData.get("place") as string);
    const isDone = Boolean(formData.get("isDone"));
    const consumables = JSON.parse(
      formData.get("consumables")!.toString()
    ) as Array<{ id: number; count: number }>;

    if (!placeId) throw ApiError.badRequest("Вы ввели не все данные!");

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
        isDone: right?.orderSuccesing ? isDone : oldOrder?.isDone,
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

    if (oldOrder?.isDone !== newOrder.isDone) {
      for (let i = 0; i < consumables.length; i++) {
        const сonsumable = await db.consumable.findFirst({
          where: {
            id: consumables[i].id,
          },
        });
        if (!сonsumable)
          throw ApiError.badRequest("Такого расходника не существует!");
        if (newOrder.isDone && сonsumable?.count - consumables[i].count < 0)
          throw ApiError.badRequest(
            "Невозможно подтвердить из-за нехватки количества расходника"
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

    return {
      data: {
        message: "Успешно отредактировано!",
      },
    };
  } catch (error) {
    return {
      error: {
        message: String(
          error instanceof ApiError ? error.message : "Ошибка сервера"
        ),
      },
    };
  }
};
