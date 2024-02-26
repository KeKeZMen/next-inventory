import { ConsumablesTable, db } from "@/shared";
import { ProductsTable } from "@/shared/ui/ProductsTable";
import React from "react";

export default async function ConsumablePage({
  params,
}: {
  params: { modelId: string };
}) {
  const consumable = await db.consumable.findMany({
    where: {
      modelId: Number(params.modelId),
    },
  });

  return (
    <ConsumablesTable title="Позиции" height="300px">
      {consumable.map((consumable) => (
        <></>
      ))}
    </ConsumablesTable>
  );
}
