import { db } from "@/shared";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/shared/lib/authOptions";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.isAdmin)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

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
