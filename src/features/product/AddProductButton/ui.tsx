"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, FC, useEffect, ChangeEvent } from "react";
import { toast } from "react-hot-toast";
import { AddButton, Button, Checkbox, Input, Modal, Select } from "@/shared";
import useSWR from "swr";
import { typesFetcher } from "@/entities/type/api";
import { placesFetcher } from "@/entities/place/api";
import { cabinetsFetcher } from "@/entities/cabinet/api";
import { useFormState, createPortal } from "react-dom";
import { addProduct } from "./api";

export const AddProductButton: FC = () => {
  const router = useRouter();
  const [state, formAction] = useFormState(addProduct, null);
  const { cabinetId: currentCabinetId, placeId: currentPlaceId } = useParams();

  const { data: types } = useSWR("/api/type", typesFetcher);

  const [selectedPlaceId, setSelectedPlaceId] = useState(
    String(currentPlaceId ?? "")
  );
  const { data: places } = useSWR("/api/place", placesFetcher);
  const handleSelectPlace = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlaceId(String(e.target.value));
  };

  const { data: cabinets } = useSWR(
    `/api/cabinet/${selectedPlaceId}`,
    cabinetsFetcher
  );

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
      <AddButton onClick={handleModal} />

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <form
              className="flex justify-center items-center flex-col md:w-[421px] gap-3 overflow-y-auto"
              action={formAction}
            >
              <h5 className="md:self-start self-center text-base uppercase">
                Добавить позицию
              </h5>

              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Название*"
                required
                fullWidth
              />

              <div className="flex flex-col md:flex-row w-full justify-between gap-3">
                <div className="flex flex-col gap-3 md:w-[50%]">
                  <Input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Описание"
                    fullWidth
                  />

                  <Input
                    type="text"
                    name="inventoryNumber"
                    id="inventoryNumber"
                    placeholder="Инвентарный номер*"
                    required
                    fullWidth
                  />

                  <Input
                    type="number"
                    name="count"
                    id="count"
                    placeholder="Количество*"
                    required
                    fullWidth
                  />
                </div>

                <div className="flex flex-col gap-3 md:w-[50%]">
                  {types && (
                    <Select name="type" id="type" required>
                      {types.map((type) => (
                        <option value={String(type.id)} key={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </Select>
                  )}

                  {places && (
                    <Select
                      value={selectedPlaceId}
                      onChange={handleSelectPlace}
                    >
                      {places.map((place) => (
                        <option value={String(place.id)} key={place.id}>
                          {place.name}
                        </option>
                      ))}
                    </Select>
                  )}

                  {cabinets && (
                    <Select
                      name="cabinet"
                      id="cabinet"
                      defaultValue={String(currentCabinetId ?? "")}
                      required
                    >
                      {cabinets.map((cabinet) => (
                        <option value={String(cabinet.id)} key={cabinet.id}>
                          {cabinet.name}
                        </option>
                      ))}
                    </Select>
                  )}
                </div>
              </div>

              <Checkbox id="onUtil" name="onUtil" label="На утилизацию" />

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
