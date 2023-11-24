"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, FC, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { CabinetActionType, ICabinet } from "../lib/types";
import { Button, Input, Select } from "@/shared";
import useSWR, { Fetcher } from "swr";
import { IPlace } from "@/entities/place/lib/types";
import { User } from "next-auth";

const placesFetcher: Fetcher<Array<IPlace>, string> = (url) =>
  fetch(url).then((res) => res.json());

const usersFetcher: Fetcher<Array<User>, string> = (url) =>
  fetch(url).then((res) => res.json());

type PropsType = {
  formTitle: string;
  submitTitle: string;
  onSubmitAction: (args: CabinetActionType) => any;
  cabinet?: ICabinet;
  onClose?: () => void;
};

export const CabinetForm: FC<PropsType> = ({
  formTitle,
  submitTitle,
  onSubmitAction,
  cabinet,
  onClose,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const [selectedPlaceId, setSelectedPlaceId] = useState(
    cabinet ? String(cabinet.placeId) : params ? String(params.placeId) : ""
  );
  const [selectedResponsible, setSelectedResponsible] = useState(
    cabinet ? String(cabinet.responsibleId) : ""
  );

  const { data: places } = useSWR("/api/place", placesFetcher);
  const { data: users } = useSWR("/api/user", usersFetcher);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: cabinet ? cabinet.name : "",
      responsible: selectedResponsible,
      placeId: selectedPlaceId,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      await onSubmitAction({
        name: data.name,
        responsibleId: parseInt(selectedResponsible),
        placeId: parseInt(selectedPlaceId),
        cabinetId: cabinet?.id,
      });

      setIsLoading(false);

      router.refresh();
      onClose?.();
    } catch (error) {
      setIsLoading(false);
      toast.error("Ошибка сервера");
    }
  };

  const handleSelectRight = (value: string) => {
    setSelectedPlaceId(value);
  };

  const handleSelectUsers = (value: string) => {
    setSelectedResponsible(value);
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

      {users && (
        <Select
          options={users.map((user) => ({
            label: user.name!,
            value: String(user.id!),
          }))}
          selected={selectedResponsible}
          onChange={handleSelectUsers}
          placeholder="Ответственный"
          fullwidth
        />
      )}

      {places && (
        <Select
          options={places.map((place) => ({
            label: place.name,
            value: String(place.id),
          }))}
          onChange={handleSelectRight}
          selected={selectedPlaceId}
          placeholder="Права*"
          fullwidth
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
