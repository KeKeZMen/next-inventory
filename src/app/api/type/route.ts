import { db } from "@/shared";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (!right?.productActions && !right?.typeActions && !right?.consumablesActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const types = await db.type.findMany();

  return Response.json(types);
}
