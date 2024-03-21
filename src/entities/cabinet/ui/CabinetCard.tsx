import { db } from "@/shared";
import { authOptions } from "@/shared/lib/authOptions";
import { Cabinet } from "@prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";

type PropsType = {
  cabinet: Cabinet;
  deleteButton?: JSX.Element;
  editButton?: JSX.Element;
  passportButton?: JSX.Element;
};

export const CabinetCard = async ({
  cabinet,
  deleteButton,
  editButton,
  passportButton,
}: PropsType) => {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const right = await db.right.findFirst({
    where: {
      id: session.user?.rightId,
    },
  });

  return (
    <div className="group inline-block relative">
      <Link
        href={`/place/${cabinet.placeId}/cabinet/${cabinet.id}`}
        className="bg-primary text-white rounded-md w-16 h-9 flex justify-center items-center"
      >
        {cabinet.name}
      </Link>
      {right?.cabinetActions && (
        <div className="absolute hidden bg-white shadow-md group-hover:flex justify-between items-center p-1 z-10 rounded-md">
          {deleteButton}
          {editButton}
          {passportButton}
        </div>
      )}
    </div>
  );
};
