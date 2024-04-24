import { TypeCard } from "@/entities/type/ui/TypeCard";
import { db } from "@/shared";
import React from "react";

export default async function TypesCards() {
  const types = await db.type.findMany();

  return (
    <div className="flex flex-col shadow-md p-4 w-full">
      <h3 className="mb-3">Оборудование</h3>

      <div className="flex flex-wrap gap-3 h-full overflow-y-auto justify-start items-start">
        {types.map((type) => (
          <TypeCard type={type} key={type.id} />
        ))}
      </div>
    </div>
  );
}
