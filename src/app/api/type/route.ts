import { db } from "@/shared";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function DELETE(req: Request) {
  const { typeId } = await req.json();
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const rights = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (!rights?.typeActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.type.delete({
    where: {
      id: typeId,
    },
  });

  return Response.json({ message: "Тип удален!" });
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

  if (!rights?.typeActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.type.create({
    data: {
      name: body.name,
    },
  });

  return Response.json({ message: "Тип создан!" });
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

  if (!rights?.typeActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.type.update({
    where: {
      id: body.typeId,
    },
    data: {
      name: body.name,
    },
  });

  return Response.json({ message: "Тип отредактирован!" });
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  // const right = await db.right.findFirst({
  //   where: {
  //     id: session.user.rightId,
  //   },
  // });

  // if (!right?.productActions || !right?.typeActions)
  //   return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const types = await db.type.findMany();

  return Response.json(types);
}
