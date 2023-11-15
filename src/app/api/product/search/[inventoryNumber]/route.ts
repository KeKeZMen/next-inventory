import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { db } from "@/shared";

export async function GET(
  req: Request,
  { params }: { params?: { inventoryNumber?: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { message: "Вы не авторизованы" },
      { status: 401 }
    );

  if (!params)
    return NextResponse.json(
      { message: "Вы не авторизованы" },
      { status: 401 }
    );

  const products = await db.product.findMany({
    where: { inventoryNumber: { contains: params.inventoryNumber } },
    select: {
      name: true,
      inventoryNumber: true,
      cabinet: {
        select: {
          id: true,
          name: true,
          place: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(products);
}
