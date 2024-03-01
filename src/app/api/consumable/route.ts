import { db } from "@/shared";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

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

  const consumable = await db.consumable.create({
    data: {
      name: body.name,
      count: body.count,
      required: body.required,
    },
  });

  await db.consumableToModel.createMany({
    data: [
      ...body.models.map((model: string) => ({
        consumableId: consumable.id,
        modelId: Number(model),
      })),
    ],
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

  await db.consumableToModel.deleteMany({
    where: {
      consumableId: body.id,
    },
  });

  const consumable = await db.consumable.update({
    where: {
      id: body.id,
    },
    data: {
      name: body.name,
      count: body.count,
      required: body.required,
    },
  });

  await db.consumableToModel.createMany({
    data: [
      ...body.models.map((model: string) => ({
        consumableId: consumable.id,
        modelId: Number(model),
      })),
    ],
  });

  return Response.json({ message: "Расходник отредактирован!" });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Нет доступа" }, { status: 401 });

  const consumables = await db.consumable.findMany();

  return NextResponse.json(consumables);
}
