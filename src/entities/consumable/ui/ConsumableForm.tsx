"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, FC } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IConsumable, ConsumableActionType } from "../lib/types";
import { Button, Checkbox, Input } from "@/shared";
import useSWR, { Fetcher } from "swr";
import { IModel } from "@/entities/model/lib/types";

const modelsFetcher: Fetcher<Array<IModel>, string> = (url) =>
  fetch(url).then((res) => res.json());

type PropsType = {
  formTitle: string;
  submitTitle: string;
  onSubmitAction: (args: ConsumableActionType) => any;
  consumable?: IConsumable;
  onClose?: () => void;
};

export const ConsumableForm: FC<PropsType> = ({
  formTitle,
  submitTitle,
  onSubmitAction,
  consumable,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { typeId } = useParams();
  const { data: models } = useSWR(`/api/model/${typeId}`, modelsFetcher);
  const [selectedModels, setSelectedModels] = useState<Array<string>>(
    consumable?.models?.map((model) => String(model.id)) ?? []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: consumable?.name ?? "",
      count: consumable?.count ?? 0,
      required: consumable?.required ?? false,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      await onSubmitAction({
        id: consumable?.id,
        name: data.name,
        models: selectedModels,
        count: Number(data.count),
        required: data.required,
      });

      setIsLoading(false);

      router.refresh();
      onClose?.();
    } catch (error) {
      setIsLoading(false);
      toast.error("Ошибка сервера");
    }
  };

  const handleSelectPlace = (value: string) => {
    if (selectedModels.includes(value))
      setSelectedModels((prev) => [...prev.filter((p) => p !== value)]);
    else setSelectedModels((prev) => [...prev, value]);
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

      <Input
        type="number"
        disabled={isLoading}
        errors={errors}
        id="count"
        placeholder="Количество*"
        required
        fullWidth
        register={register}
      />

      <div className="w-full h-[200px] overflow-y-auto">
        {models?.map((model) => (
          <Checkbox
            register={register}
            key={model.id}
            id={`${model.id}`}
            defaultChecked={selectedModels?.includes(String(model.id))}
            label={`${model.name}`}
            value={model.id}
            onChange={(e) => handleSelectPlace(e.target.value)}
          />
        ))}
      </div>

      <Checkbox
        register={register}
        id="required"
        name="required"
        defaultChecked={consumable?.required}
        label="Обязательный"
      />

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
