import { RightRow } from "@/entities/right/ui/RightRow";
import { AddRightButton } from "@/features/right/AddRightButton/ui";
import { DeleteRightButton } from "@/features/right/DeleteRightButton/ui";
import { EditRightButton } from "@/features/right/EditRightButton/ui";
import { DataTable, db } from "@/shared";
import React from "react";

export default async function RightsTable() {
  const rights = await db.right.findMany({
    where: {
      NOT: {
        id: 1,
      },
    },
  });

  return (
    <DataTable title="Права" addAction={<AddRightButton />}>
      {rights.map((right) => (
        <RightRow
          right={right}
          deleteButton={<DeleteRightButton rightId={right.id} />}
          editButton={<EditRightButton right={right} />}
          key={right.id}
        />
      ))}
    </DataTable>
  );
}
