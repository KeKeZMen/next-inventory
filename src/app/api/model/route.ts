import { db } from "@/shared";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { modelId } = await req.json();

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

  await db.model.delete({
    where: {
      id: modelId,
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

  await db.model.create({
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

  await db.model.update({
    where: {
      id: body.id,
    },
    data: {
      name: body.name,
      typeId: body.typeId,
    },
  });

  return Response.json({ message: "Модель отредактирована!" });
}
