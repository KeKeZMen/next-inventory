"use server";

import { db } from "@/shared";
import { ApiError } from "@/shared/api/ApiError";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export const deleteConsumable = async (consumableId: number) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw ApiError.unauthorized();

    const right = await db.right.findFirst({
      where: {
        id: session.user.rightId,
      },
    });
    if (!right?.consumablesActions) throw ApiError.noEnoughRights();

    const consumable = await db.consumable.findFirst({
      where: {
        id: consumableId,
      },
      select: {
        orderItem: true,
      },
    });

    if (!consumable) throw ApiError.badRequest("Расходника не существует!");
    if (consumable.orderItem.length !== 0)
      throw ApiError.badRequest("Расходник присутствует в заказе!");

    await db.consumable.delete({
      where: {
        id: consumableId,
      },
    });

    return {
      data: {
        message: "Успешно удалено!",
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
