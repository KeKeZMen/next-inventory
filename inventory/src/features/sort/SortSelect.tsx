"use client";

import { Select } from "@/shared";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

type SortActionType = {
  value: string;
  key: "inventoryNumber" | "serialNumber";
  orderBy: "asc" | "desc";
  label: string;
};

const sortOptions: Array<SortActionType> = [
  {
    value: "0",
    key: "inventoryNumber",
    orderBy: "asc",
    label: "Инв. по возрастанию",
  },
  {
    value: "1",
    key: "inventoryNumber",
    orderBy: "desc",
    label: "Инв. по убыванию",
  },
];

export const SortSelect = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const [selectedOrderBy, setSelectedOrderBy] = useState("0");

  const handleSelectOrder = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOrderBy(String(e.target.value));
  };

  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("key", sortOptions[parseInt(selectedOrderBy)].key);
    current.set("orderBy", sortOptions[parseInt(selectedOrderBy)].orderBy);

    let search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathName}${query}`);
    router.refresh();
  }, [selectedOrderBy]);

  return (
    <Select
      onChange={handleSelectOrder}
      selectPadding="5px"
      containerPadding="5px"
      className="w-[200px]"
    >
      {sortOptions.map((option) => (
        <option value={String(option.value)} key={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
};
