"use server";

import { db } from "@/shared";
import { ApiError } from "@/shared/api/ApiError";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export const addProduct = async (state: any, formData: FormData) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw ApiError.unauthorized();

    const right = await db.right.findFirst({
      where: {
        id: session.user.rightId,
      },
    });
    if (!right?.productActions) throw ApiError.noEnoughRights();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const inventoryNumber = formData.get("inventoryNumber") as string;
    const count = Number(formData.get("count") as string);
    const typeId = Number(formData.get("type") as string);
    const cabinetId = Number(formData.get("cabinet") as string);
    const onUtil = Boolean(formData.get("onUtil"));

    if (!name || !inventoryNumber || !count || !typeId || !cabinetId)
      throw ApiError.badRequest("Вы ввели не все данные!");

    await db.product.create({
      data: {
        name,
        description,
        count,
        inventoryNumber,
        cabinetId,
        typeId,
        userAdded: session.user.id,
        onUtil,
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
