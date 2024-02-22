import { TypeRow } from "@/entities/type/ui/TypeRow";
import { AddTypeButton } from "@/features/type/AddTypeButton";
import { DeleteTypeButton } from "@/features/type/DeleteTypeButton";
import { EditTypeButton } from "@/features/type/EditTypeButton";
import { DataTable, db } from "@/shared";
import React from "react";

export const TypesTable = async () => {
  const types = await db.type.findMany();

  return (
    <DataTable title="Типы оборудования" addAction={<AddTypeButton />} height="400px">
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
