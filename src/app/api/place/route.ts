import { db } from "@/shared";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.isAdmin)
    return Response.json({ message: "Вы не авторизованы!" }, { status: 401 });

  const places = await db.place.findMany({
    where: {
      userPlace: {
        some: {
          userId: session.user?.id,
        },
      },
    },
  });

  return Response.json(places);
}
