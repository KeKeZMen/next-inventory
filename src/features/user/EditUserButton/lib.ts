"use server";

import { db } from "@/shared";
import { ApiError } from "@/shared/api/ApiError";
import { authOptions } from "@/shared/lib/authOptions";
import { createHash } from "crypto";
import { getServerSession } from "next-auth";

export const editUser = async (state: any, formData: FormData) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw ApiError.unauthorized();

    const right = await db.right.findFirst({
      where: {
        id: session.user.rightId,
      },
    });
    if (!right?.userActions) throw ApiError.noEnoughRights();

    const id = Number(formData.get("userId") as string);
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const rightId = Number(formData.get("rightId") as string);
    const places = (formData.get("selectedPlaces") as string).split(",");

    const user = await db.user.update({
      where: {
        id,
      },
      data: {
        name: name,
        password: createHash("sha256").update(password).digest("hex"),
        rightId: rightId,
      },
    });

    await db.userPlace.deleteMany({
      where: {
        userId: id,
      },
    });

    if (places[0] !== "") {
      await db.userPlace.createMany({
        data: [
          ...places.map((p: string) => ({
            placeId: Number(p),
            userId: user.id,
          })),
        ],
      });
    }

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
