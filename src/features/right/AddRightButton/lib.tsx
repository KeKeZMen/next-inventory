"use server";

import { db } from "@/shared";
import { ApiError } from "@/shared/api/ApiError";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export const addRight = async (state: any, formData: FormData) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw ApiError.unauthorized();

    const right = await db.right.findFirst({
      where: {
        id: session.user.rightId,
      },
    });
    if (!right?.rightActions) throw ApiError.noEnoughRights();

    const name = formData.get("name") as string;
    const placeActions = Boolean(formData.get("placeActions") as string);
    const productActions = Boolean(formData.get("productActions") as string);
    const rightActions = Boolean(formData.get("rightActions") as string);
    const typeActions = Boolean(formData.get("typeActions") as string);
    const userActions = Boolean(formData.get("userActions") as string);
    const cabinetActions = Boolean(formData.get("cabinetActions") as string);
    const consumablesActions = Boolean(
      formData.get("consumablesActions") as string
    );
    const orderSuccesing = Boolean(formData.get("orderSuccesing") as string);

    await db.right.create({
      data: {
        cabinetActions,
        consumablesActions,
        name,
        orderSuccesing,
        placeActions,
        productActions,
        rightActions,
        typeActions,
        userActions,
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
