import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { db } from "@/shared";

export async function GET(
  req: Request,
  { params }: { params?: { consumableName?: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.isAdmin)
    return NextResponse.json(
      { message: "Недостаточно прав!" },
      { status: 401 }
    );

  if (!params)
    return NextResponse.json(
      { message: "Недостаточно прав!" },
      { status: 401 }
    );

  const consumables = await db.consumable.findMany({
    where: {
      name: {
        contains: params.consumableName,
      },
    },
    select: {
      id: true,
      count: true,
      name: true,
    },
  });

  return NextResponse.json(consumables);
}
