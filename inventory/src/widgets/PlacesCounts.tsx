import { PlaceRow } from "@/entities/place/ui/PlaceRow";
import { DataTable, db } from "@/shared";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react";

export const PlacesCounts = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) return redirect("/login"); 

  const place = await db.place.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          cabinets: true,
        },
      },
    },
    where: {
      cabinets: {
        some: {
          placeId: {
            in: session.user.places.map((place) => Number(place)),
          },
        },
      },
    },
  });

  return (
    <DataTable title="Кабинеты по площадкам">
      {place.map(({ id, name, _count }) => (
        <PlaceRow
          place={{ id, name }}
          cabinetsCount={_count.cabinets}
          key={id}
        />
      ))}
    </DataTable>
  );
};
