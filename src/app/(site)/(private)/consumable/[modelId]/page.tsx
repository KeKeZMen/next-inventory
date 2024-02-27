import { ConsumableRow } from "@/entities/consumable/ui/ConsumableRow";
import { AddConsumableButton } from "@/features/consumable/AddConsumableButton";
import { DeleteConsumableButton } from "@/features/consumable/DeleteConsumableButton";
import { EditConsumableButton } from "@/features/consumable/EditConsumableButton";
import { ModelSelect } from "@/features/model/ModelSelect";
import { ConsumablesTable, db } from "@/shared";
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
    <ConsumablesTable
      title="Расходники"
      height="700px"
      addButton={<AddConsumableButton />}
      selects={<ModelSelect />}
    >
      {consumable.map((consumable) => (
        <ConsumableRow
          consumable={consumable}
          deleteButton={<DeleteConsumableButton consumableId={consumable.id} />}
          editButton={<EditConsumableButton consumable={consumable} />}
          key={consumable.id}
        />
      ))}
    </ConsumablesTable>
  );
}
