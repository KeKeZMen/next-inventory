import { TypeCard } from "@/entities/type/ui/TypeCard";
import { db } from "@/shared";
import React from "react";

export default async function TypesCards() {
  const types = await db.type.findMany({});

  return (
    <div className="flex flex-col shadow-md p-4 w-full max-h-[70vh]">
      <h3 className="mb-3">Оборудование</h3>

      <div className="flex flex-wrap gap-2 h-full overflow-y-auto">
        {types.map((type) => (
          <TypeCard type={type} key={type.id} />
        ))}
      </div>
    </div>
  );
}
