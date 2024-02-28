"use client";

import { useRouter } from "next/navigation";
import { useState, FC } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IOrder, OrderActionType } from "../lib/types";
import { Button, Checkbox, Select } from "@/shared";
import useSWR, { Fetcher } from "swr";
import { IPlace } from "@/entities/place/lib/types";

const placesFetcher: Fetcher<Array<IPlace>, string> = (url) =>
  fetch(url).then((res) => res.json());

type PropsType = {
  formTitle: string;
  submitTitle: string;
  onSubmitAction: (args: OrderActionType) => any;
  order?: IOrder;
  onClose?: () => void;
  consumables?: JSX.Element;
  orderItems?: JSX.Element;
};

export const OrderForm: FC<PropsType> = ({
  formTitle,
  submitTitle,
  onSubmitAction,
  order,
  onClose,
  consumables,
  orderItems,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(
    order ? String(order.placeId) : ""
  );

  const { data: places } = useSWR("/api/place", placesFetcher);

  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      placeId: selectedPlaceId,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      await onSubmitAction({
        id: order?.id,
        isDone: data.isDone,
        placeId: Number(selectedPlaceId),
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
    setSelectedPlaceId(value);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-center items-center flex-col min-w-[521px] gap-3"
    >
      <h5 className="md:self-start self-center text-base uppercase">
        {formTitle}
      </h5>

      {places && (
        <Select
          options={places.map((place) => ({
            label: place.name,
            value: String(place.id),
          }))}
          onChange={handleSelectPlace}
          selected={selectedPlaceId}
          placeholder="Площадка*"
          fullwidth
        />
      )}

      {consumables && orderItems && (
        <div className="flex gap-3 flex-col md:flex-row w-full">
          {orderItems}
          {consumables}
        </div>
      )}

      <Checkbox
        id="isDone"
        name="isDone"
        register={register}
        defaultChecked={order?.isDone}
        label="Готов"
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
