import { PlaceRow } from "@/entities/place/ui/PlaceRow";
import { DataTable, db } from "@/shared";
import React from "react";

export const PlacesCounts = async () => {
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
