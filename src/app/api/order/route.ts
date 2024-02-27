import { db } from "@/shared";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function DELETE(req: Request) {
  const { orderId } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session?.user)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (!right?.consumablesActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.order.delete({
    where: {
      id: orderId,
    },
  });

  return Response.json({ message: "Кабинет удален!" });
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
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.order.create({
    data: {
      ...body,
    },
  });

  return Response.json({ message: "Кабинет создан!" });
}

export async function PATCH(req: Request) {
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
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.order.update({
    where: {
      id: body.id,
    },
    data: {
      placeId: body.placeId,
      isDone: body.isDone,
    },
  });

  return Response.json({ message: "Кабинет отредактирован!" });
}
