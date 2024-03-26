"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, FC, useEffect } from "react";
import { Button, EditButton, Input, Modal, Select } from "@/shared";
import useSWR from "swr";
import { placesFetcher } from "@/entities/place/api";
import { usersFetcher } from "@/entities/user/api";
import { editCabinet } from "./lib";
import { useFormState, createPortal } from "react-dom";
import toast from "react-hot-toast";
import type { Cabinet } from "@prisma/client" 

type PropsType = {
  cabinet: Cabinet
}

export const EditCabinetButton: FC<PropsType> = ({ cabinet }) => {
  const params = useParams();
  const router = useRouter()
  const [state, formAction] = useFormState(editCabinet, null);

  const { data: places } = useSWR("/api/place", placesFetcher);
  const [selectedPlace, setSelectedPlace] = useState(
    cabinet ? String(cabinet.placeId) : params ? String(params.placeId) : ""
  );
  const handleSelectPlace = (value: string) => {
    setSelectedPlace(value);
  };

  const { data: users } = useSWR("/api/user", usersFetcher);
  const [selectedResponsible, setSelectedResponsible] = useState(
    cabinet ? String(cabinet.responsibleId) : ""
  );
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
      <EditButton onClick={handleModal} />

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <form
              className="flex justify-center items-center flex-col w-[321px] gap-3"
              action={(formData) => {
                formData.append("cabinetId", String(cabinet.id))
                formData.append("placeId", selectedPlace);
                formData.append("responsibleId", selectedResponsible);
                formAction(formData);
              }}
            >
              <h5 className="md:self-start self-center text-base uppercase">
                Отредактировать кабинет
              </h5>

              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Название*"
                required
                fullWidth
                defaultValue={cabinet.name}
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

                <Button type="submit">Отредактировать</Button>
              </div>
            </form>
          </Modal>,
          document.body
        )}
    </>
  );
};
