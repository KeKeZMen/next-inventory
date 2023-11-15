"use client";

import { FC, useRef } from "react";

type PropsType = {
  cabinetId: number;
};

export const CabinetPassportButton: FC<PropsType> = ({ cabinetId }) => {
  const aRef = useRef<HTMLAnchorElement>(null);

  const handleGetCabinetPassport = async () => {
    const res = await fetch(`/api/cabinet/passport/${cabinetId}`, {
      method: "GET",
    });

    const buf = Buffer.from(await res.arrayBuffer())

    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    if (aRef.current) {
      aRef.current.href = URL.createObjectURL(blob);
      aRef.current.download = `Паспорт кабинета.xlsx`;
      aRef.current.style.backgroundImage = "url('/doneexcel.svg')"
    }
  };

  return (
    <a
      ref={aRef}
      onClick={handleGetCabinetPassport}
      className="bg-no-repeat bg-center h-6 w-6"
      style={{ backgroundImage: "url('/excel.svg')" }}
    />
  );
};
