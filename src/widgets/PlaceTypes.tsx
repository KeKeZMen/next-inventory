import { TypeRow } from "@/entities/type/ui/TypeRow";
import { DataTable, db } from "@/shared";
import React from "react";

type PropsType = {
  placeId: number;
};

export const PlaceTypes = async ({ placeId }: PropsType) => {
  const types = await db.type.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          products: {
            where: {
              cabinet: {
                placeId: placeId,
              },
            },
          },
        },
      },
    },
  });

  return (
    <DataTable title="Статистика" width="25%">
      {types.map((type) => (
        <TypeRow
          type={type}
          key={type.id}
          productsCount={type._count.products}
        />
      ))}
    </DataTable>
  );
};
