import { db } from "@/shared";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { placeId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  // const right = await db.right.findFirst({
  //   where: {
  //     id: session.user.rightId,
  //   },
  // });

  // if (!right?.cabinetActions || !right?.productActions)
  //   return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const cabinets = await db.cabinet.findMany({
    where: {
      placeId: parseInt(params.placeId),
    },
  });

  return NextResponse.json(cabinets);
}
