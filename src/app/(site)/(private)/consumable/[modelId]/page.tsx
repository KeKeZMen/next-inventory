import { db } from "@/shared";
import { ProductsTable } from "@/shared/ui/ProductsTable";
import React from "react";


export default async function ConsumablePage({
  params,
}: {
  params: { modelId: string };
}) {

  const consumable = await db.consumable.findMany({
    where: {
      model_id: Number(params.modelId)
    }
  });

  return (
    <ProductsTable
      title="Позиции"
      height="300px"
    >
      {consumable.map((consumable) => (
        <></>
      ))}
    </ProductsTable>
  );
}
