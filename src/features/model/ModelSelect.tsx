"use client";

import { IModel } from "@/entities/model/lib/types";
import { Select } from "@/shared";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { Fetcher } from "swr";

const modelsFetcher: Fetcher<Array<IModel>, string> = (url) =>
  fetch(url).then((res) => res.json());

export const ModelSelect = () => {
  const { modelId: currentModelId } = useParams();
  const router = useRouter();

  const [modelId, setModelId] = useState(currentModelId.toString());
  const { data: models } = useSWR("/api/model", modelsFetcher);

  const handleSelectModel = (value: string) => {
    setModelId(value);
  };

  useEffect(() => {
    router.push(`${modelId}`);
  }, [modelId]);

  if (models)
    return (
      <Select
        options={models.map((type) => ({
          label: type.name,
          value: String(type.id),
        }))}
        selected={modelId}
        placeholder="Модель*"
        minWidth="100px"
        onChange={handleSelectModel}
        margin="0 15px 0 0"
        padding="3px"
      />
    );
};
