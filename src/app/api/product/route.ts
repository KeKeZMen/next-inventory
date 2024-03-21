import { db } from "@/shared";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export async function DELETE(req: Request) {
  const { productId } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session?.user)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (!right?.productActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.product.delete({
    where: {
      id: productId,
    },
  });

  return Response.json({ message: "Продукт удален!" });
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

  if (!right?.productActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.product.create({
    data: {
      ...body,
      userAdded: session.user.id,
    },
  });

  return Response.json({ message: "Продукт создан!" });
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

  if (!right?.productActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.product.update({
    where: {
      id: body.productId,
    },
    data: {
      cabinetId: body.cabinetId,
      count: body.count,
      description: body.description,
      inventoryNumber: body.inventoryNumber,
      name: body.name,
      onUtil: body.onUtil,
      typeId: body.typeId,
      userAdded: session.user.id,
    },
  });

  return Response.json({ message: "Продукт отредактирован!" });
}
