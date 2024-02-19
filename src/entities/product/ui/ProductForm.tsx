"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, FC } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IProduct, ProductActionType } from "../lib/types";
import { Button, Checkbox, Input, Select } from "@/shared";
import useSWR, { Fetcher } from "swr";
import { IPlace } from "@/entities/place/lib/types";
import { ICabinet } from "@/entities/cabinet/lib/types";
import { IType } from "@/entities/type/lib/types";

const placesFetcher: Fetcher<Array<IPlace>, string> = (url) =>
  fetch(url).then((res) => res.json());

const cabinetsFetcher: Fetcher<Array<ICabinet>, string> = (url) =>
  fetch(url).then((res) => res.json());

const typesFetcher: Fetcher<Array<IType>, string> = (url) =>
  fetch(url).then((res) => res.json());

type PropsType = {
  formTitle: string;
  submitTitle: string;
  onSubmitAction: (args: ProductActionType) => any;
  product?: IProduct;
  onClose?: () => void;
};

export const ProductForm: FC<PropsType> = ({
  formTitle,
  submitTitle,
  onSubmitAction,
  product,
  onClose,
}) => {
  const { cabinetId: currentCabinetId, placeId: currentPlaceId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [typeId, setTypeId] = useState(product ? String(product.typeId) : "");
  const [cabinetId, setCabinetId] = useState(
    product
      ? String(product.cabinet.id)
      : currentCabinetId
      ? currentCabinetId.toString()
      : ""
  );
  const [placeId, setPlaceId] = useState(
    product
      ? String(product.cabinet.placeId)
      : currentPlaceId
      ? currentPlaceId.toString()
      : ""
  );
  const router = useRouter();

  const { data: types } = useSWR("/api/type", typesFetcher);
  const { data: places } = useSWR("/api/place", placesFetcher);
  const { data: cabinets } = useSWR(`/api/cabinet/${placeId}`, cabinetsFetcher);

  const handleSelectType = (value: string) => {
    setTypeId(value);
  };

  const handleSelectPlace = (value: string) => {
    setPlaceId(value);
  };

  const handleSelectCabinet = (value: string) => {
    setCabinetId(value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: product ? product.name : "",
      cabinetId,
      count: product ? product.count : 1,
      description: product ? product.description : "",
      inventoryNumber: product ? product.inventoryNumber : "",
      onUtil: product ? product.onUtil : false,
      typeId,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      await onSubmitAction({
        name: data.name,
        cabinetId: parseInt(cabinetId),
        count: parseInt(data.count),
        description: data.description,
        inventoryNumber: data.inventoryNumber,
        onUtil: data.onUtil,
        typeId: parseInt(typeId),
        productId: product?.id,
      });

      setIsLoading(false);

      router.refresh();
      onClose?.();
    } catch (error) {
      setIsLoading(false);
      toast.error("Ошибка сервера");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-center items-center flex-col md:w-[721px] gap-3"
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
        type="text"
        disabled={isLoading}
        errors={errors}
        id="description"
        placeholder="Описание"
        fullWidth
        register={register}
      />

      <Input
        type="text"
        disabled={isLoading}
        errors={errors}
        id="inventoryNumber"
        placeholder="Инвентарный номер*"
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

      <Checkbox
        id="onUtil"
        register={register}
        defaultChecked={product?.onUtil}
        label="На утилизацию"
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

      {places && (
        <Select
          options={places.map((place) => ({
            label: place.name,
            value: String(place.id),
          }))}
          selected={placeId}
          placeholder="Площадка*"
          fullwidth
          onChange={handleSelectPlace}
        />
      )}

      {cabinets && (
        <Select
          options={cabinets.map((type) => ({
            label: type.name,
            value: String(type.id),
          }))}
          selected={cabinetId}
          placeholder="Кабинет*"
          fullwidth
          onChange={handleSelectCabinet}
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
