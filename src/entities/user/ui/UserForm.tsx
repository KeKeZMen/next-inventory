"use client";

import { useRouter } from "next/navigation";
import { useState, FC } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { UserActionType } from "../lib/types";
import { Button, Checkbox, Input, Select } from "@/shared";
import { IRight } from "@/entities/right/lib/types";
import useSWR, { Fetcher } from "swr";
import { User } from "next-auth";
import { IPlace } from "@/entities/place/lib/types";

const rightsFetcher: Fetcher<Array<IRight>, string> = (url) =>
  fetch(url).then((res) => res.json());
const placesFetcher: Fetcher<Array<IPlace>, string> = (url) =>
  fetch(url).then((res) => res.json());

type PropsType = {
  formTitle: string;
  submitTitle: string;
  onSubmitAction: (args: UserActionType) => any;
  user?: User;
  onClose?: () => void;
};

export const UserForm: FC<PropsType> = ({
  formTitle,
  submitTitle,
  onSubmitAction,
  user,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState<Array<string>>(
    user?.places ?? []
  );
  const [selectedRightId, setSelectedRightId] = useState(
    user ? String(user.rightId) : ""
  );
  const router = useRouter();

  const { data: rights } = useSWR("/api/right", rightsFetcher);
  const { data: places } = useSWR("/api/place", placesFetcher);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: user ? user.name : "",
      email: user ? user.email : "",
      password: "",
      rightId: selectedRightId,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      await onSubmitAction({
        name: data.name,
        password: data.password,
        rightId: parseInt(selectedRightId),
        userId: user?.id,
        places: selectedPlaces,
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
    setSelectedRightId(value);
  };

  const handleSelectPlace = (value: string) => {
    if (selectedPlaces.includes(value))
      setSelectedPlaces((prev) => [...prev.filter((p) => p !== value)]);
    else setSelectedPlaces((prev) => [...prev, value]);
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
        placeholder="Имя*"
        required
        fullWidth
        register={register}
      />

      <Input
        type="text"
        disabled={isLoading}
        errors={errors}
        id="password"
        placeholder="Пароль*"
        required
        fullWidth
        register={register}
      />

      {rights && (
        <Select
          options={rights.map((right) => ({
            label: right.name,
            value: String(right.id),
          }))}
          onChange={handleSelectRight}
          selected={selectedRightId}
          placeholder="Права*"
          fullwidth
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        {places?.map((place) => (
          <Checkbox
            register={register}
            key={place.id}
            id={`${place.id}`}
            defaultChecked={selectedPlaces?.includes(String(place.id))}
            label={`${place.name}`}
            value={place.id}
            onChange={(e) => handleSelectPlace(e.target.value)}
          />
        ))}
      </div>

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
