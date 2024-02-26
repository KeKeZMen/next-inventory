import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 md:flex-row">
        <CabinetsGrid placeId={parseInt(params.placeId)} />
        <PlaceTypes placeId={parseInt(params.placeId)} />
      </div>
      {children}
    </div>
  );
}