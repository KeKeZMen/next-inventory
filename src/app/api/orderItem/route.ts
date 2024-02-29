import { db } from "@/shared";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { orderItemId } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session?.user)
    return NextResponse.json({ message: "Недостаточно прав" }, { status: 401 });

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (!right?.consumablesActions)
    return NextResponse.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.orderItem.delete({
    where: {
      id: orderItemId,
    },
  });

  return NextResponse.json({ message: "Удалено!" });
}

export async function POST(req: Request) {
  const body = await req.json();
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (!right?.consumablesActions)
    return NextResponse.json({ message: "Недостаточно прав" }, { status: 401 });

  const isHaveItemInOrder = await db.order.findFirst({
    where: {
      id: body.orderId,
      orderItems: {
        some: {
          consumableId: {
            equals: body.consumableId,
          },
        },
      },
    },
  });

  if (isHaveItemInOrder)
    return NextResponse.json({
      message: "Нельзя добавить в заказ существующую позицию",
    }, { status: 400 });

  await db.orderItem.create({
    data: {
      ...body,
    },
  });

  return NextResponse.json({ message: "Добавлено!" });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return NextResponse.json({ message: "Недостаточно прав" }, { status: 401 });

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (!right?.consumablesActions)
    return NextResponse.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.orderItem.update({
    where: {
      id: body.orderItemId,
    },
    data: {
      count: body.newCount,
    },
  });

  return NextResponse.json({ message: "Количество изменено!" });
}
