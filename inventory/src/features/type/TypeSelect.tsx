"use client";

import { typesFetcher } from "@/entities/type/api";
import { Select } from "@/shared";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import useSWR from "swr";

export const TypeSelect = () => {
  const { typeId: currentTypeId } = useParams();
  const router = useRouter();

  const [typeId, setTypeId] = useState(currentTypeId.toString());
  const { data: types } = useSWR("/api/type", typesFetcher);

  const handleSelectType = (e: ChangeEvent<HTMLSelectElement>) => {
    setTypeId(String(e.target.value));
  };

  useEffect(() => {
    router.push(`${typeId}`);
  }, [typeId]);

  if (types)
    return (
      <Select value={typeId} onChange={handleSelectType} className="w-[200px]" containerPadding="5px" selectPadding="5px">
        {types.map((type) => (
          <option value={String(type.id)} key={type.id}>{type.name}</option>
        ))}
      </Select>
    );
};
