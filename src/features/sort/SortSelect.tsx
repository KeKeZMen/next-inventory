"use client";

import { Select } from "@/shared";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  const pathName = usePathname()
  const searchParams = useSearchParams()

  const [selectedOrderBy, setSelectedOrderBy] = useState("0");

  const handleSelectOrder = (value: string) => {
    setSelectedOrderBy(value)
  };
  
  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set("key", sortOptions[parseInt(selectedOrderBy)].key)
    current.set("orderBy", sortOptions[parseInt(selectedOrderBy)].orderBy)

    let search = current.toString()
    const query = search ? `?${search}` : ""

    router.push(`${pathName}${query}`);
    router.refresh()
  }, [selectedOrderBy])

  return (
    <Select
      padding="3px"
      margin="0 10px 0 0"
      selected={selectedOrderBy}
      options={sortOptions.map((sortOption) => ({
        label: sortOption.label,
        value: sortOption.value,
      }))}
      onChange={handleSelectOrder}
      minWidth="300px"
    />
  );
};
