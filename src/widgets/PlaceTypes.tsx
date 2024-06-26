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
    <div className="md:w-[25%] h-full">
      <DataTable title="Статистика">
        {types.map((type) => (
          <TypeRow
            type={type}
            key={type.id}
            productsCount={type._count.products}
          />
        ))}
      </DataTable>
    </div>
  );
};
