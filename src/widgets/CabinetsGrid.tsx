import { CabinetCard } from "@/entities/cabinet/ui/CabinetCard";
import { AddCabinetButton } from "@/features/cabinet/AddCabinetButton/ui";
import { DeleteCabinetButton } from "@/features/cabinet/DeleteCabinetButton/ui";
import { EditCabinetButton } from "@/features/cabinet/EditCabinetButton/ui";
import { CabinetPassportButton } from "@/features/passport/CabinetPassportButton";
import { db } from "@/shared";
import React from "react";

type PropsType = {
  placeId: number;
  isAdmin?: boolean;
};

export const CabinetsGrid = async ({ placeId, isAdmin }: PropsType) => {
  const cabinets = await db.cabinet.findMany({
    where: {
      placeId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="p-4 shadow-md md:w-[75%] h-full">
      <div className="flex justify-between items-center mb-3">
        <h3>Кабинеты: {cabinets.length}</h3>
        {isAdmin && <AddCabinetButton />}
      </div>
      <div className="flex flex-wrap justify-start gap-2 md:overflow-y-auto h-[calc(100%-24px)]">
        {cabinets.map((cabinet) => (
          <CabinetCard
            cabinet={cabinet}
            key={cabinet.id}
            isAdmin={isAdmin}
            deleteButton={<DeleteCabinetButton cabinetId={cabinet.id} />}
            editButton={<EditCabinetButton cabinet={cabinet} />}
            passportButton={<CabinetPassportButton cabinetId={cabinet.id} />}
          />
        ))}
      </div>
    </div>
  );
};
