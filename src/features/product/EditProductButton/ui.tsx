"use client";

import { useRouter } from "next/navigation";
import { useState, FC, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button, Checkbox, EditButton, Input, Modal, Select } from "@/shared";
import useSWR from "swr";
import { typesFetcher } from "@/entities/type/api";
import { placesFetcher } from "@/entities/place/api";
import { cabinetsFetcher } from "@/entities/cabinet/api";
import { useFormState, createPortal } from "react-dom";
import { editProduct } from "./lib";
import { IProductWithCabinet } from "@/shared/lib/typecode";

type PropsType = {
  product: IProductWithCabinet
}

export const EditProductButton: FC<PropsType> = ({ product }) => {
  const router = useRouter();
  const [state, formAction] = useFormState(editProduct, null);

  const { data: types } = useSWR("/api/type", typesFetcher);
  const [selectedTypeId, setSelectedTypeId] = useState(String(product.typeId ?? ""));
  const handleSelectType = (value: string) => {
    setSelectedTypeId(value);
  };

  const [selectedPlaceId, setSelectedPlaceId] = useState(String(product.cabinet.placeId ?? ""));
  const { data: places } = useSWR("/api/place", placesFetcher);
  const handleSelectPlace = (value: string) => {
    setSelectedPlaceId(value);
  };

  const [selectedCabinetId, setSelectedCabinetId] = useState(String(product.cabinet.id ?? ""));
  const { data: cabinets } = useSWR(
    `/api/cabinet/${selectedPlaceId}`,
    cabinetsFetcher
  );
  const handleSelectCabinet = (value: string) => {
    setSelectedCabinetId(value);
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
              className="flex justify-center items-center flex-col md:w-[421px] gap-3 overflow-y-auto"
              action={(formData) => {
                formData.append("productId", String(product.id));
                formData.append("typeId", selectedTypeId);
                formData.append("cabinetId", selectedCabinetId);
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
                      options={types.map((type) => ({
                        label: type.name,
                        value: String(type.id),
                      }))}
                      selected={selectedTypeId}
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
                      selected={selectedPlaceId}
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
                      selected={selectedCabinetId}
                      placeholder="Кабинет*"
                      fullwidth
                      onChange={handleSelectCabinet}
                    />
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
