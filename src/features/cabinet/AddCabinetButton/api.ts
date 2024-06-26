"use server"

import { db } from "@/shared";
import { ApiError } from "@/shared/api/ApiError";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export const addCabinet = async (state: any, formData: FormData) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw ApiError.unauthorized();

    const right = await db.right.findFirst({
      where: {
        id: session.user.rightId,
      },
    });
    if (!right?.cabinetActions) throw ApiError.noEnoughRights();

    const name = formData.get("name") as string;
    const responsibleId = Number(formData.get("responsible") as string);
    const placeId = Number(formData.get("place") as string);

    if (!name && !placeId) throw ApiError.badRequest("Вы ввели не все данные!");
    
    await db.cabinet.create({
      data: {
        name,
        placeId,
        responsibleId: responsibleId !== 0 ? responsibleId : null,
      },
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
