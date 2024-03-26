"use client";

import { useRouter } from "next/navigation";
import { useState, FC, useEffect } from "react";
import { toast } from "react-hot-toast";
import { AddButton, Button, Input, Modal, Select } from "@/shared";
import useSWR from "swr";
import { typesFetcher } from "@/entities/type/api";
import { useFormState, createPortal } from "react-dom";
import { addModel } from "./lib";

export const AddModelButton: FC = () => {
  const router = useRouter();
  const [state, formAction] = useFormState(addModel, null);

  const { data: types } = useSWR("/api/type", typesFetcher);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const handleSelectType = (value: string) => {
    setSelectedTypeId(value);
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
      <AddButton onClick={handleModal} />

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <form
              action={(formData) => {
                formData.append("typeId", String(selectedTypeId));
                formAction(formData);
              }}
              className="flex justify-center items-center flex-col w-[321px] gap-3"
            >
              <h5 className="md:self-start self-center text-base uppercase">
                Добавить модель
              </h5>

              <Input
                type="text"
                id="name"
                placeholder="Название*"
                required
                fullWidth
                name="name"
              />

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
