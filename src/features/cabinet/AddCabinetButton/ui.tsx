"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, FC, useEffect } from "react";
import { AddButton, Button, Input, Modal, Select } from "@/shared";
import useSWR from "swr";
import { placesFetcher } from "@/entities/place/api";
import { usersFetcher } from "@/entities/user/api";
import { addCabinet } from "./lib";
import { useFormState, createPortal } from "react-dom";
import toast from "react-hot-toast";

export const AddCabinetButton: FC = () => {
  const [state, formAction] = useFormState(addCabinet, null);
  const params = useParams();
  const router = useRouter()

  const { data: places } = useSWR("/api/place", placesFetcher);
  const [selectedPlace, setSelectedPlace] = useState(
    params ? String(params.placeId) : ""
  );
  const handleSelectPlace = (value: string) => {
    setSelectedPlace(value);
  };

  const { data: users } = useSWR("/api/user", usersFetcher);
  const [selectedResponsible, setSelectedResponsible] = useState("");
  const handleSelectResponsible = (value: string) => {
    setSelectedResponsible(value);
  };

  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);
  const onClose = () => {
    setIsOpenedModal(false);
  };

  useEffect(() => {
    if (state?.data?.message) {
      toast.success(state.data.message);
      router.refresh()
    } else if (state?.error?.message) {
      toast.error(state.error.message);
    }
    onClose();
  }, [state]);

  return (
    <>
      <AddButton onClick={handleModal} />

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <form
              className="flex justify-center items-center flex-col w-[321px] gap-3"
              action={(formData) => {
                formData.append("placeId", selectedPlace);
                formData.append("responsibleId", selectedResponsible);
                formAction(formData);
              }}
            >
              <h5 className="md:self-start self-center text-base uppercase">
                Добавить кабинет
              </h5>

              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Название*"
                required
                fullWidth
              />

              {users && (
                <Select
                  options={users.map((user) => ({
                    label: user.name!,
                    value: String(user.id!),
                  }))}
                  selected={selectedResponsible}
                  onChange={handleSelectResponsible}
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
                  onChange={handleSelectPlace}
                  selected={selectedPlace}
                  placeholder="Площадка*"
                  fullwidth
                />
              )}

              <div className="flex self-end justify-between items-center w-full">
                <Button onClick={onClose} danger type="button">
                  Отменить
                </Button>

                <Button type="submit">Добавить</Button>
              </div>
            </form>
          </Modal>,
          document.body
        )}
    </>
  );
};
