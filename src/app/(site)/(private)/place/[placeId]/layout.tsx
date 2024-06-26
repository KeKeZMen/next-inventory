import { db } from "@/shared";
import { authOptions } from "@/shared/lib/authOptions";
import { CabinetsGrid } from "@/widgets/CabinetsGrid";
import { PlaceTypes } from "@/widgets/PlaceTypes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function PlaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { placeId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.places.includes(params.placeId)) return redirect("/");

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  return (
    <div className="flex flex-col gap-2 relative h-full">
      <div className="flex flex-col gap-2 md:flex-row md:h-[25%]">
        <CabinetsGrid
          placeId={parseInt(params.placeId)}
          isAdmin={right?.cabinetActions}
        />
        <PlaceTypes placeId={parseInt(params.placeId)} />
      </div>
      <div className="h-[500px] md:h-[75%]">{children}</div>
    </div>
  );
}
