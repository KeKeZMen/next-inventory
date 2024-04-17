"use server";

import { db } from "@/shared";
import { ApiError } from "@/shared/api/ApiError";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export const editConsumable = async (state: any, formData: FormData) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw ApiError.unauthorized();

    const right = await db.right.findFirst({
      where: {
        id: session.user.rightId,
      },
    });
    if (!right?.consumablesActions) throw ApiError.noEnoughRights();

    const name = formData.get("name") as string;
    const models = (formData.get("models") as string).split(",");
    const count = Number(formData.get("count") as string);
    const consumableId = Number(formData.get("consumableId") as string);
    const required = Boolean(formData.get("required") as string);
    
    if (!name && !count) throw ApiError.badRequest("Вы ввели не все данные!");


    if (models[0] == "")
      throw ApiError.badRequest("Расходник не может существовать без моделей!");

    await db.consumableToModel.deleteMany({
      where: {
        consumableId,
      },
    });

    const consumable = await db.consumable.update({
      where: {
        id: consumableId,
      },
      data: {
        name,
        count,
        required,
      },
    });

    await db.consumableToModel.createMany({
      data: [
        ...models.map((model: string) => ({
          consumableId: consumable.id,
          modelId: Number(model),
        })),
      ],
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
