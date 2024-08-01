"use client";

import { useRouter } from "next/navigation";
import { useState, FC, useEffect } from "react";
import { Button, Checkbox, EditButton, Input, Modal, Select } from "@/shared";
import useSWR from "swr";
import { rightsFetcher } from "@/entities/right/api";
import { placesFetcher } from "@/entities/place/api";
import { useFormState, createPortal } from "react-dom";
import { editUser } from "./api";
import toast from "react-hot-toast";
import { User } from "next-auth";

type PropsType = {
  user: User;
};

export const EditUserButton: FC<PropsType> = ({ user }) => {
  const [state, formAction] = useFormState(editUser, null);
  const router = useRouter();

  const { data: rights } = useSWR("/api/right", rightsFetcher);

  const { data: places } = useSWR("/api/place", placesFetcher);
  const [selectedPlaces, setSelectedPlaces] = useState<Array<string>>(
    user.places ?? []
  );
  const handleSelectPlace = (value: string) => {
    if (selectedPlaces.includes(value))
      setSelectedPlaces((prev) => [...prev.filter((p) => p !== value)]);
    else setSelectedPlaces((prev) => [...prev, value]);
  };

  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);
  const onClose = () => {
    setIsOpenedModal(false);
  };

  useEffect(() => {
    if (state?.data?.message) {
      toast.success(state.data.message);
      router.refresh();
    } else if (state?.error?.message) {
      toast.error(state.error.message);
    }
    onClose();
  }, [state]);

  return (
    <>
      <EditButton onClick={handleModal} />

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <form
              className="flex justify-center items-center flex-col w-[321px] gap-3"
              action={(formData) => {
                formData.append("userId", String(user.id));
                formData.append("selectedPlaces", selectedPlaces.join(","));
                formAction(formData);
              }}
            >
              <h5 className="md:self-start self-center text-base uppercase">
                Отредактировать пользователя
              </h5>

              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Имя*"
                required
                defaultValue={String(user.name)}
                fullWidth
                key={`edit-${user.id}-name`}
              />

              <Input
                type="text"
                name="password"
                id="password"
                placeholder="Пароль*"
                required
                fullWidth
                key={`edit-${user.id}-pass`}
              />

              {rights && (
                <Select
                  name="right"
                  id="right"
                  defaultValue={String(user.rightId ?? "")}
                  className="w-full"
                  required
                >
                  {rights.map((right) => (
                    <option value={String(right.id)} key={right.id}>
                      {right.name}
                    </option>
                  ))}
                </Select>
              )}

              <div className="grid grid-cols-2 gap-3">
                {places?.map((place) => (
                  <Checkbox
                    key={`edit-${user.id}-${place.id}-place`}
                    id={`${place.id}`}
                    defaultChecked={selectedPlaces?.includes(String(place.id))}
                    label={`${place.name}`}
                    value={place.id}
                    onChange={(e) => handleSelectPlace(e.target.value)}
                  />
                ))}
              </div>

              <div className="flex self-end justify-between items-center w-full">
                <Button onClick={onClose} danger type="button">
                  Отменить
                </Button>

                <Button type="submit">Отредактировать</Button>
              </div>
            </form>
          </Modal>,
          document.body
        )}
    </>
  );
};
