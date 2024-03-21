import { db } from "@/shared";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { typeId: string } }
) {
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

  const models = await db.model.findMany({
    where: {
      typeId: Number(params.typeId),
    },
  });

  return NextResponse.json(models);
}
