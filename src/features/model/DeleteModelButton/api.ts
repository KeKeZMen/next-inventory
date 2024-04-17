"use server";

import { db } from "@/shared";
import { ApiError } from "@/shared/api/ApiError";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export const deleteModel = async (modelId: number) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw ApiError.unauthorized();

    const right = await db.right.findFirst({
      where: {
        id: session.user.rightId,
      },
    });
    if (!right?.consumablesActions) throw ApiError.noEnoughRights();

    const model = await db.model.findFirst({
      where: {
        id: modelId,
      },
      select: {
        consumables: true,
      },
    });

    if (!model) throw ApiError.badRequest("Модели не существует!");
    if (model.consumables.length !== 0)
      throw ApiError.badRequest(
        "Существуют расходники, подходящие к удаляемой модели!"
      );

    await db.model.delete({
      where: {
        id: modelId,
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
