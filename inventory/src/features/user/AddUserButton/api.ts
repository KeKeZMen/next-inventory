"use server";

import { db } from "@/shared";
import { ApiError } from "@/shared/api/ApiError";
import { authOptions } from "@/shared/lib/authOptions";
import { createHash } from "crypto";
import { getServerSession } from "next-auth";

export const addUser = async (state: any, formData: FormData) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw ApiError.unauthorized();

    const right = await db.right.findFirst({
      where: {
        id: session.user.rightId,
      },
    });
    if (!right?.userActions) throw ApiError.noEnoughRights();

    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const rightId = Number(formData.get("right") as string);
    const places = (formData.get("selectedPlaces") as string).split(",");

    if (!name || !password || !rightId)
      throw ApiError.badRequest("Вы ввели не все данные!");

    const user = await db.user.create({
      data: {
        name,
        password: createHash("sha256").update(password).digest("hex"),
        rightId,
      },
    });

    await db.userPlace.createMany({
      data: [
        ...places.map((p: string) => ({
          placeId: Number(p),
          userId: user.id,
        })),
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
