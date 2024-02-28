import { ConsumableRow } from "@/entities/consumable/ui/ConsumableRow";
import { AddConsumableButton } from "@/features/consumable/AddConsumableButton";
import { DeleteConsumableButton } from "@/features/consumable/DeleteConsumableButton";
import { EditConsumableButton } from "@/features/consumable/EditConsumableButton";
import { TypeSelect } from "@/features/type/TypeSelect";
import { ConsumablesTable, db } from "@/shared";
import React from "react";

export default async function ConsumablePage({
  params,
}: {
  params: { typeId: string };
}) {
  const consumable = await db.consumable.findMany({
    where: {
      model: {
        some: {
          model: {
            typeId: Number(params.typeId),
          },
        },
      },
    },
    select: {
      id: true,
      count: true,
      name: true,
      required: true,
      model: {
        select: {
          model: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });

  return (
    <ConsumablesTable
      title="Расходники"
      addButton={<AddConsumableButton />}
      selects={<TypeSelect />}
    >
      {consumable
        .map((consumable) => ({
          id: consumable.id,
          name: consumable.name,
          models: consumable.model.map((model) => ({
            id: model.model.id,
            name: model.model.name,
          })),
          required: consumable.required,
          count: consumable.count,
        }))
        .map((consumable) => (
          <ConsumableRow
            consumable={consumable}
            deleteButton={
              <DeleteConsumableButton consumableId={consumable.id} />
            }
            editButton={<EditConsumableButton consumable={consumable} />}
            key={consumable.id}
          />
        ))}
    </ConsumablesTable>
  );
}
