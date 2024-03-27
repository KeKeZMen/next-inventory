"use client";

import { Cabinet } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

type PropsType = {
  cabinet: Cabinet;
  isAdmin?: boolean;
  deleteButton?: JSX.Element;
  editButton?: JSX.Element;
  passportButton?: JSX.Element;
};

export const CabinetCard: FC<PropsType> = ({
  cabinet,
  isAdmin,
  deleteButton,
  editButton,
  passportButton,
}) => {
  const pathName = usePathname();

  return (
    <div className="group relative w-[109px] h-9">
      <Link
        href={`/place/${cabinet.placeId}/cabinet/${cabinet.id}`}
        className={clsx(
          "text-white rounded-md w-full h-full flex justify-center items-center",
          pathName.includes(`/cabinet/${cabinet.id}`)
            ? "bg-light-primary"
            : "bg-primary"
        )}
      >
        {cabinet.name}
      </Link>
      {isAdmin && (
        <div className="absolute hidden bg-white shadow-md group-hover:flex justify-between items-center p-1 z-[1000] rounded-md left-[50%] -translate-x-1/2">
          {deleteButton}
          {editButton}
          {passportButton}
        </div>
      )}
    </div>
  );
};
