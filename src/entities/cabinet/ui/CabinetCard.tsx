import { Cabinet } from "@prisma/client";
import Link from "next/link";

type PropsType = {
  cabinet: Cabinet;
  isAdmin?: boolean;
  deleteButton?: JSX.Element;
  editButton?: JSX.Element;
  passportButton?: JSX.Element;
};

export const CabinetCard = ({
  cabinet,
  isAdmin,
  deleteButton,
  editButton,
  passportButton,
}: PropsType) => {
  return (
    <div className="group relative w-28 h-9">
      <Link
        href={`/place/${cabinet.placeId}/cabinet/${cabinet.id}`}
        className="bg-primary text-white rounded-md w-full h-full flex justify-center items-center"
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
