import { TypeRow } from "@/entities/type/ui/TypeRow";
import { AddTypeButton } from "@/features/type/AddTypeButton/ui";
import { DeleteTypeButton } from "@/features/type/DeleteTypeButton/ui";
import { EditTypeButton } from "@/features/type/EditTypeButton/ui";
import { DataTable, db } from "@/shared";
import React from "react";

export const TypesTable = async () => {
  const types = await db.type.findMany();

  return (
    <DataTable title="Типы оборудования" addAction={<AddTypeButton />}>
      {types.map((type) => (
        <TypeRow
          type={type}
          deleteButton={<DeleteTypeButton typeId={type.id} />}
          editButton={<EditTypeButton type={type} />}
          key={type.id}
        />
      ))}
    </DataTable>
  );
};
