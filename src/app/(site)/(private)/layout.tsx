import { ReactNode } from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { Menu } from "@/widgets/Menu";
import { Header } from "@/widgets/Header";
import { db } from "@/shared";
import { redirect } from "next/navigation";

export default async function layout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) return redirect("/login");

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (!right) return redirect("/login");

  const { id, name, ...rest } = right;

  if (!Object.values(rest).find((r) => r)) redirect("/cabinet");

  const places = await db.place.findMany({
    where: {
      userPlace: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  return (
    <div className="flex h-full">
      <Menu places={places} user={session.user} />
      <div className="flex flex-col w-full">
        <Header user={session.user} />
        <main className="pt-[80px] md:bg-gray md:p-6 h-full">
          <div className="md:bg-white md:rounded-md md:p-[50px] h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
