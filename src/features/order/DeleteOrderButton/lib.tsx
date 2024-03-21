"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/shared";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const deleteOrder = async (orderId: number) => {
  try {
    const session = await getServerSession(authOptions);
    const right = await db.right.findFirst({
      where: {
        id: session?.user?.rightId,
      },
      select: {
        consumablesActions: true,
      },
    });
    if (!session?.user && !right?.consumablesActions) {
      throw new Error("Нет доступа");
    }

    await db.orderItem.deleteMany({
      where: {
        orderId,
      },
    });

    await db.order.delete({
      where: {
        id: orderId,
      },
    });

    revalidatePath("/orders", "page");

    return { data: { message: "Успешно удалено!" } };
  } catch (error) {
    return { error: { message: String(error) } };
  }
};
