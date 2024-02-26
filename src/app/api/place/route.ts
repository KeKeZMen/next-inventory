import { db } from "@/shared";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Prisma } from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return Response.json({ message: "Вы не авторизованы!" }, { status: 401 });

  const places = await db.place.findMany();

  return Response.json(places);
}

export async function DELETE(req: Request) {
  const { placeId } = await req.json();
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const rights = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (!rights?.placeActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  try {
    await db.place.delete({
      where: {
        id: placeId,
      },
    });

    return Response.json({ message: "Площадка удалена!" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return Response.json(
          { message: "Сначала вы должны удалить все кабинеты внутри площадки" },
          { status: 403 }
        );
      }
    }
  }
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

  if (!rights?.placeActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const place = await db.place.create({
    data: {
      name: body.name,
    },
  });

  await db.userPlace.create({
    data: {
      placeId: place.id,
      userId: 1
    }
  })

  return Response.json({ message: "Площадка создана!" });
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

  if (!rights?.placeActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  await db.place.update({
    where: {
      id: body.placeId,
    },
    data: {
      name: body.name,
    },
  });

  return Response.json({ message: "Площадка отредактирована!" });
}
