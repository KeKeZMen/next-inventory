import { db } from "@/shared";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (!right?.rightActions || !right.userActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const rights = await db.right.findMany({
    where: {
      NOT: {
        id: 1
      }
    }
  })

  return Response.json(rights)
}

export async function DELETE(req: Request) {
  const rightId = await req.json();

  const session = await getServerSession(authOptions);

  if (!session?.user)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (!right?.rightActions && !right?.userActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.right.delete({
    where: {
      id: rightId,
    },
  });

  return Response.json({ message: "Права удалены!" });
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

  if (!right?.rightActions && !right?.userActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.right.create({
    data: {
      ...body,
    },
  });

  return Response.json({ message: "Права созданы!" });
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

  if (!right?.rightActions && !right?.userActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.right.update({
    where: {
      id: body.rightId,
    },
    data: {
      cabinetActions: body.cabinetActions,
      placeActions: body.placeActions,
      productActions: body.productActions,
      rightActions: body.rightActions,
      typeActions: body.typeActions,
      userActions: body.userActions,
      consumablesActions: body.consumablesActions,
      name: body.name,
    },
  });

  return Response.json({ message: "Права отредактированы!" });
}
