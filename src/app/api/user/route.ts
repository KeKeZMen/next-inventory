import { db } from "@/shared";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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
