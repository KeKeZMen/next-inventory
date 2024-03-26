"use server";

import { db } from "@/shared";
import { ApiError } from "@/shared/api/ApiError";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export const deletePlace = async (placeId: number) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw ApiError.unauthorized();

    const right = await db.right.findFirst({
      where: {
        id: session.user.rightId,
      },
    });
    if (!right?.placeActions) throw ApiError.noEnoughRights();

    const place = await db.place.findFirst({
      where: {
        id: placeId,
      },
      select: {
        cabinets: true,
      },
    });

    if (!place) throw ApiError.badRequest("Площадки не существует!");
    if (place.cabinets.length !== 0)
      throw ApiError.badRequest("В площадке есть кабинеты!");

    await db.place.delete({
      where: {
        id: placeId,
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
