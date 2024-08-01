"use server";

import { db } from "@/shared";
import { ApiError } from "@/shared/api/ApiError";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export const deleteCabinet = async (cabinetId: number) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw ApiError.unauthorized();

    const right = await db.right.findFirst({
      where: {
        id: session.user.rightId,
      },
    });
    if (!right?.cabinetActions) throw ApiError.noEnoughRights();

    const cabinet = await db.cabinet.findFirst({
      where: {
        id: cabinetId,
      },
      select: {
        products: true,
      },
    });

    if (!cabinet) throw ApiError.badRequest("Кабинета не существует!");
    if (cabinet.products.length !== 0)
      throw ApiError.badRequest("В кабинете есть оборудование!");

    await db.cabinet.delete({
      where: {
        id: cabinetId,
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
