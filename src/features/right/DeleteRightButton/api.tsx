"use server";

import { db } from "@/shared";
import { ApiError } from "@/shared/api/ApiError";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export const deleteRight = async (rightId: number) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw ApiError.unauthorized();

    const userRight = await db.right.findFirst({
      where: {
        id: session.user.rightId,
      },
    });
    if (!userRight?.rightActions) throw ApiError.noEnoughRights();

    const right = await db.right.findFirst({
      where: {
        id: rightId,
      },
      select: {
        user: true,
      },
    });

    if (!right) throw ApiError.badRequest("Прав не существует!");
    if (right.user.length !== 0)
      throw ApiError.badRequest("Есть пользователи с удаляемыми правами!");

    await db.right.delete({
      where: {
        id: rightId,
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
