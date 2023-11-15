import { db } from "@/shared";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function DELETE(req: Request) {
  const { cabinetId } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session?.user)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (!right?.cabinetActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.cabinet.delete({
    where: {
      id: cabinetId,
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

  if (!right?.cabinetActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  // const adminUsers = await db.user.findMany({
  //   where: {
  //     right: { placeActions: true },
  //   },
  // });

  const cabinet = await db.cabinet.create({
    data: {
      ...body,
    },
  });

  // await db.userCabinet.createMany({
  //   data: [
  //     ...adminUsers.map((user) => ({
  //       cabinetId: cabinet.id,
  //       userId: user.id,
  //     })),
  //   ],
  // });

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

  if (!right?.cabinetActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.cabinet.update({
    where: {
      id: body.cabinetId,
    },
    data: {
      name: body.name,
      placeId: body.placeId,
      responsibleId: body.responsibleId,
    },
  });

  return Response.json({ message: "Кабинет отредактирован!" });
}