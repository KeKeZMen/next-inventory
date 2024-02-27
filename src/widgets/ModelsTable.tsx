import { ModelRow } from "@/entities/model/ui/ModelRow";
import { AddModelButton } from "@/features/model/AddModelButton";
import { DeleteModelButton } from "@/features/model/DeleteModelButton";
import { EditModelButton } from "@/features/model/EditModelButton";
import { DataTable, db } from "@/shared";
import React from "react";

export const ModelsTable = async () => {
  const models = await db.model.findMany();

  return (
    <DataTable
      title="Модели"
      addAction={<AddModelButton />}
      height="300px"
    >
      {models.map((model) => (
        <ModelRow
          model={model}
          key={model.id}
          deleteButton={<DeleteModelButton modelId={model.id} />}
          editButton={<EditModelButton model={model} />}
        />
      ))}
    </DataTable>
  );
};