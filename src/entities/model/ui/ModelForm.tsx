"use client";

import { useRouter } from "next/navigation";
import { useState, FC } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IModel, ModelActionType } from "../lib/types";
import { Button, Input, Select } from "@/shared";
import useSWR, { Fetcher } from "swr";
import { IType } from "@/entities/type/lib/types";

const typesFetcher: Fetcher<Array<IType>, string> = (url) =>
  fetch(url).then((res) => res.json());

type PropsType = {
  formTitle: string;
  submitTitle: string;
  onSubmitAction: (args: ModelActionType) => any;
  model?: IModel;
  onClose?: () => void;
};

export const ModelForm: FC<PropsType> = ({
  formTitle,
  submitTitle,
  onSubmitAction,
  model,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: types } = useSWR("/api/type", typesFetcher);
  const [typeId, setTypeId] = useState(model ? String(model.typeId) : "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: model?.name ?? "",
      typeId: typeId,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      await onSubmitAction({
        id: model?.id,
        name: data.name,
        typeId: Number(typeId),
      });

      setIsLoading(false);

      router.refresh();
      onClose?.();
    } catch (error) {
      setIsLoading(false);
      toast.error("Ошибка сервера");
    }
  };

  const handleSelectType = (value: string) => {
    setTypeId(value);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-center items-center flex-col w-[321px] gap-3"
    >
      <h5 className="md:self-start self-center text-base uppercase">
        {formTitle}
      </h5>

      <Input
        type="text"
        disabled={isLoading}
        errors={errors}
        id="name"
        placeholder="Название*"
        required
        fullWidth
        register={register}
      />

      {types && (
        <Select
          options={types.map((type) => ({
            label: type.name,
            value: String(type.id),
          }))}
          selected={typeId}
          placeholder="Тип*"
          fullwidth
          onChange={handleSelectType}
        />
      )}

      <div className="flex self-end justify-between items-center w-full">
        <Button onClick={onClose} danger disabled={isLoading}>
          Отменить
        </Button>

        <Button type="submit" disabled={isLoading}>
          {submitTitle}
        </Button>
      </div>
    </form>
  );
};
