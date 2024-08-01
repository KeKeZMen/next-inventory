import { db } from "@/shared";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.isAdmin)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const types = await db.type.findMany();

  return Response.json(types);
}
