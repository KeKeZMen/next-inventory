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

  if (!right?.rightActions && !right?.userActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const rights = await db.right.findMany({
    where: {
      NOT: {
        id: 1,
      },
    },
  });

  return Response.json(rights);
}
