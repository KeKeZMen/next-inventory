import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "@/shared";
import { authOptions } from "@/shared/lib/authOptions";

export async function GET(
  req: Request,
  { params }: { params?: { inventoryNumber?: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.isAdmin)
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
