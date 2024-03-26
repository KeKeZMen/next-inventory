"use server";

import { db } from "@/shared";
import { ApiError } from "@/shared/api/ApiError";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export const editType = async (state: any, formData: FormData) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw ApiError.unauthorized();

    const right = await db.right.findFirst({
      where: {
        id: session.user.rightId,
      },
    });
    if (!right?.typeActions) throw ApiError.noEnoughRights();

    const id = Number(formData.get("typeId") as string);
    const name = formData.get("name") as string;

    await db.type.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    return {
      data: {
        message: "Успешно отредактировано!",
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
