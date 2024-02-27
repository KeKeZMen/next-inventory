import { db } from "@/shared";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function DELETE(req: Request) {
  const { consumableId } = await req.json();

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

  await db.consumable.delete({
    where: {
      id: consumableId,
    },
  });

  return Response.json({ message: "Модель удалена!" });
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

  await db.consumable.create({
    data: {
      ...body,
    },
  });

  return Response.json({ message: "Модель создана!" });
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

  await db.consumable.update({
    where: {
      id: body.id,
    },
    data: {
      name: body.name,
      count: body.count,
      modelId: body.modelId,
      required: body.required,
    },
  });

  return Response.json({ message: "Модель отредактирована!" });
}
