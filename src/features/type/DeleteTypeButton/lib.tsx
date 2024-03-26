"use server";

import { db } from "@/shared";
import { ApiError } from "@/shared/api/ApiError";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export const deleteType = async (typeId: number) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw ApiError.unauthorized();

    const right = await db.right.findFirst({
      where: {
        id: session.user.rightId,
      },
    });
    if (!right?.typeActions) throw ApiError.noEnoughRights();

    const type = await db.type.findFirst({
      where: {
        id: typeId,
      },
      select: {
        products: true,
        models: true,
      },
    });

    if (!type) throw ApiError.badRequest("Типа не существует!");
    if (type.products.length !== 0)
      throw ApiError.badRequest("Есть позиции с удаляемым типом!");
    if(type.models.length !== 0) throw ApiError.badRequest("Есть модели с удаляемым типом!")

    await db.type.delete({
      where: {
        id: typeId,
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
