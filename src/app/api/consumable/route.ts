import { db } from "@/shared";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Нет доступа" }, { status: 401 });

  const consumables = await db.consumable.findMany();

  return NextResponse.json(consumables);
}
