import { CabinetsGrid } from "@/widgets/CabinetsGrid";
import { PlaceTypes } from "@/widgets/PlaceTypes";
import { ReactNode } from "react";

export default async function PlaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { placeId: string };
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 md:grid md:grid-cols-[2fr,_1fr]">
        <CabinetsGrid placeId={parseInt(params.placeId)} />
        <PlaceTypes placeId={parseInt(params.placeId)} />
      </div>

      {children}
    </div>
  );
}
