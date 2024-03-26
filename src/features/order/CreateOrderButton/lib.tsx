"use server";

import { db } from "@/shared";
import { ApiError } from "@/shared/api/ApiError";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export const createOrder = async (state: any, formData: FormData) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw ApiError.unauthorized();

    const right = await db.right.findFirst({
      where: {
        id: session?.user?.rightId,
      },
    });
    if (!right?.consumablesActions) throw ApiError.noEnoughRights();

    const placeId = Number(formData.get("placeId") as string);
    const isDone = Boolean(formData.get("isDone"));
    const consumables = JSON.parse(
      formData.get("consumables")!.toString()
    ) as Array<{ id: number; count: number }>;

    if (!placeId) throw ApiError.badRequest("Вы ввели не все данные!");

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

    if (order.isDone) {
      for (let i = 0; i < consumables.length; i++) {
        const сonsumable = await db.consumable.findFirst({
          where: {
            id: consumables[i].id,
          },
        });
        if (!сonsumable)
          throw ApiError.badRequest("Такого картриджа не существует!");
        if (сonsumable?.count - consumables[i].count < 0)
          throw ApiError.badRequest(
            "Невозможно подтвердить из-за нехватки количества позиций"
          );

        await db.consumable.update({
          where: {
            id: consumables[i].id,
          },
          data: {
            count: {
              decrement: consumables[i].count,
            },
          },
        });
      }
    }

    return {
      data: {
        message: "Успешно создано!",
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
