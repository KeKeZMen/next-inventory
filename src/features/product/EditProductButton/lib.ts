"use server";

import { db } from "@/shared";
import { ApiError } from "@/shared/api/ApiError";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export const editProduct = async (state: any, formData: FormData) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw ApiError.unauthorized();

    const right = await db.right.findFirst({
      where: {
        id: session.user.rightId,
      },
    });
    if (!right?.productActions) throw ApiError.noEnoughRights();

    const id = Number(formData.get("productId") as string);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const inventoryNumber = formData.get("inventoryNumber") as string;
    const count = Number(formData.get("count") as string);
    const typeId = Number(formData.get("typeId") as string);
    const cabinetId = Number(formData.get("cabinetId") as string);
    const onUtil = Boolean(formData.get("onUtil"));

    if (!name || !inventoryNumber || !count || !typeId || !cabinetId)
      throw ApiError.badRequest("Вы ввели не все данные!");

    await db.product.update({
      where: {
        id,
      },
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
