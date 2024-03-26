"use client";

import { typesFetcher } from "@/entities/type/api";
import { Select } from "@/shared";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

export const TypeSelect = () => {
  const { typeId: currentTypeId } = useParams();
  const router = useRouter();

  const [typeId, setTypeId] = useState(currentTypeId.toString());
  const { data: types } = useSWR("/api/type", typesFetcher);

  const handleSelectType = (value: string) => {
    setTypeId(value);
  };

  useEffect(() => {
    router.push(`${typeId}`);
  }, [typeId]);

  if (types)
    return (
      <Select
        options={types.map((type) => ({
          label: type.name,
          value: String(type.id),
        }))}
        selected={typeId}
        placeholder="Тип*"
        minWidth="300px"
        onChange={handleSelectType}
        margin="0 15px 0 0"
        padding="3px"
      />
    );
};
