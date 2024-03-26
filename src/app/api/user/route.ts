import { db } from "@/shared";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/shared/lib/authOptions";

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
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json(users);
}
