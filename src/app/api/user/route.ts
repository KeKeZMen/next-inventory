import { db } from "@/shared";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createHash } from "crypto";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { userId } = await req.json();
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const rights = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (!rights?.userActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.user.delete({
    where: {
      id: userId,
    },
  });

  return Response.json({ message: "Пользователь удален!" });
}

export async function POST(req: Request) {
  const body = await req.json();
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const rights = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (!rights?.userActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const user = await db.user.create({
    data: {
      name: body.name,
      password: createHash("sha256").update(body.password).digest("hex"),
      rightId: body.rightId,
    },
  });

  await db.userPlace.createMany({
    data: [
      ...body.places.map((p: string) => ({
        placeId: Number(p),
        userId: user.id,
      })),
    ],
  });

  return Response.json({ message: "Пользователь создан!" });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const rights = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (!rights?.userActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const user = await db.user.update({
    where: {
      id: body.userId,
    },
    data: {
      name: body.name,
      password: createHash("sha256").update(body.password).digest("hex"),
      rightId: body.rightId,
    },
  });

  await db.userPlace.deleteMany({
    where: {
      userId: body.userId,
    },
  });

  await db.userPlace.createMany({
    data: [
      ...body.places.map((p: string) => ({
        placeId: Number(p),
        userId: user.id,
      })),
    ],
  });

  return Response.json({ message: "Пользователь отредактирован!" });
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const right = await db.right.findFirst({
    where: {
      id: session.user.id,
    },
  });

  if (!right?.cabinetActions && !right?.userActions)
    return NextResponse.json({ message: "Недостаточно прав" }, { status: 401 });

  const users = await db.user.findMany({
    where: {
      NOT: {
        id: 1,
        AND: [
          { right: { cabinetActions: true } },
          { right: { placeActions: true } },
          { right: { rightActions: true } },
          { right: { productActions: true } },
          { right: { typeActions: true } },
          { right: { userActions: true } },
          { right: { consumablesActions: true } },
        ],
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json(users);
}
