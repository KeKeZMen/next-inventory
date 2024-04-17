"use client";

import { useRouter } from "next/navigation";
import { useState, FC, useEffect, ChangeEvent } from "react";
import { toast } from "react-hot-toast";
import { Button, Checkbox, EditButton, Input, Modal, Select } from "@/shared";
import useSWR from "swr";
import { typesFetcher } from "@/entities/type/api";
import { placesFetcher } from "@/entities/place/api";
import { cabinetsFetcher } from "@/entities/cabinet/api";
import { useFormState, createPortal } from "react-dom";
import { editProduct } from "./api";
import { IProductWithCabinet } from "@/shared/lib/typecode";

type PropsType = {
  product: IProductWithCabinet;
};

export const EditProductButton: FC<PropsType> = ({ product }) => {
  const router = useRouter();
  const [state, formAction] = useFormState(editProduct, null);

  const { data: types } = useSWR("/api/type", typesFetcher);

  const [selectedPlaceId, setSelectedPlaceId] = useState(
    String(product.cabinet.placeId ?? "")
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
      <EditButton onClick={handleModal} />

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <form
              className="flex justify-center items-center flex-col md:w-[421px] gap-3 overflow-y-auto"
              action={(formData) => {
                formData.append("productId", String(product.id));
                formAction(formData);
              }}
            >
              <h5 className="md:self-start self-center text-base uppercase">
                Отредактировать позицию
              </h5>

              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Название*"
                required
                fullWidth
                defaultValue={product.name}
              />

              <div className="flex flex-col md:flex-row w-full justify-between gap-3">
                <div className="flex flex-col gap-3 md:w-[50%]">
                  <Input
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Описание"
                    fullWidth
                    defaultValue={product.description}
                  />

                  <Input
                    type="text"
                    name="inventoryNumber"
                    id="inventoryNumber"
                    placeholder="Инвентарный номер*"
                    required
                    fullWidth
                    defaultValue={product.inventoryNumber}
                  />

                  <Input
                    type="number"
                    name="count"
                    id="count"
                    placeholder="Количество*"
                    required
                    fullWidth
                    defaultValue={product.count}
                  />
                </div>

                <div className="flex flex-col gap-3 md:w-[50%]">
                  {types && (
                    <Select
                      name="type"
                      id="type"
                      required
                      defaultValue={String(product.typeId ?? "")}
                    >
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
                        <option value={String(place.id)}>{place.name}</option>
                      ))}
                    </Select>
                  )}

                  {cabinets && (
                    <Select
                      name="cabinet"
                      id="cabinet"
                      defaultValue={String(product.cabinetId ?? "")}
                      required
                    >
                      {cabinets.map((cabinet) => (
                        <option value={String(cabinet.id)}>
                          {cabinet.name}
                        </option>
                      ))}
                    </Select>
                  )}
                </div>
              </div>

              <Checkbox
                id="onUtil"
                name="onUtil"
                label="На утилизацию"
                defaultChecked={product.onUtil}
              />

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
