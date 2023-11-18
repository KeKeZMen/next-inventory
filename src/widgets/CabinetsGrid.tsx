import { CabinetCard } from "@/entities/cabinet/ui/CabinetCard";
import { AddCabinetButton } from "@/features/cabinet/AddCabinetButton";
import { DeleteCabinetButton } from "@/features/cabinet/DeleteCabinetButton";
import { EditCabinetButton } from "@/features/cabinet/EditCabinetButton";
import { CabinetPassportButton } from "@/features/passport/CabinetPassportButton";
import { db } from "@/shared";
import React from "react";

type PropsType = {
  placeId: number;
};

export const CabinetsGrid = async ({ placeId }: PropsType) => {
  const cabinets = await db.cabinet.findMany({
    where: {
      placeId,
    },
  });

  return (
    <div className="p-4 shadow-md md:h-[200px] md:w-[75%]">
      <div className="flex justify-between items-center mb-3">
        <h3>Кабинеты: {cabinets.length}</h3>
        <AddCabinetButton />
      </div>
      <div className="flex flex-wrap justify-start gap-2 md:overflow-y-auto md:h-[80%]">
        {cabinets.map((cabinet) => (
          <CabinetCard
            cabinet={cabinet}
            key={cabinet.id}
            deleteButton={<DeleteCabinetButton cabinetId={cabinet.id} />}
            editButton={<EditCabinetButton cabinet={cabinet} />}
            passportButton={<CabinetPassportButton cabinetId={cabinet.id} />}
          />
        ))}
      </div>
    </div>
  );
};
