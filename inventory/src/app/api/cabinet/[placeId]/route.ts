import { db } from "@/shared";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { placeId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.isAdmin)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const cabinets = await db.cabinet.findMany({
    where: {
      placeId: parseInt(params.placeId),
    },
  });

  return NextResponse.json(cabinets);
}
