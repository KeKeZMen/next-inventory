import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { db } from "@/shared";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Нет доступа" }, { status: 401 });

  const orderItems = await db.orderItem.findMany({
    where: {
      orderId: Number(params.orderId),
    },
    select: {
      consumable: {
        select: {
          name: true,
        },
      },
      count: true,
      id: true,
      consumableId: true,
    },
  });

  return NextResponse.json(orderItems);
}
