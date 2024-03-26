import { FC } from "react";
import type { Type } from "@prisma/client";
import Link from "next/link";

type PropsType = {
  type: Type;
};

export const TypeCard: FC<PropsType> = ({ type }) => {
  return (
    <Link
      href={`/type/${type.id}`}
      className="flex items-center justify-center flex-col shadow-md bg-gray w-[90px] h-[90px] md:w-[170px] md:h-[170px]"
    >
      <div
        className="bg-no-repeat bg-center w-16 h-16 md:w-20 md:h-20"
        style={{ backgroundImage: "url('/cube.svg')" }}
      />
      <p className="uppercase font-bold text-xs md:text-lg text-center">
        {type.name}
      </p>
    </Link>
  );
};
