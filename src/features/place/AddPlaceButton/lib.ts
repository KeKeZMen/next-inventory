"use server";

import { db } from "@/shared";
import { ApiError } from "@/shared/api/ApiError";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export const addPlace = async (state: any, formData: FormData) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw ApiError.unauthorized();

    const right = await db.right.findFirst({
      where: {
        id: session.user.rightId,
      },
    });
    if (!right?.placeActions) throw ApiError.noEnoughRights();

    const name = formData.get("name") as string;

    const place = await db.place.create({
      data: {
        name,
      },
    });

    await db.userPlace.createMany({
      data: [
        { placeId: place.id, userId: session.user.id },
        { placeId: place.id, userId: 1 },
      ],
    });

    return {
      data: {
        message: "Успешно добавлено!",
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
