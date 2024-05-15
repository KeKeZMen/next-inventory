import { ConsumableRow } from "@/entities/consumable/ui/ConsumableRow";
import { AddConsumableButton } from "@/features/consumable/AddConsumableButton/ui";
import { DeleteConsumableButton } from "@/features/consumable/DeleteConsumableButton/ui";
import { EditConsumableButton } from "@/features/consumable/EditConsumableButton/ui";
import { ConsumablesTable, db } from "@/shared";
import { ProductsSelects } from "@/features/product/ProductsSelects";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/authOptions";
import { redirect } from "next/navigation";

export default async function ConsumablePage({
  params,
}: {
  params: { typeId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) return redirect("/login");

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

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
      selects={<ProductsSelects typeSelect />}
      isAdmin={right?.consumablesActions}
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
            isAdmin={right?.consumablesActions}
          />
        ))}
    </ConsumablesTable>
  );
}
