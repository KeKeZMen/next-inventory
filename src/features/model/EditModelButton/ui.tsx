"use client";

import { useRouter } from "next/navigation";
import { useState, FC, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button, EditButton, Input, Modal, Select } from "@/shared";
import useSWR from "swr";
import { typesFetcher } from "@/entities/type/api";
import { useFormState, createPortal } from "react-dom";
import { editModel } from "./api";
import type { Model } from "@prisma/client";

type PropsType = {
  model: Model;
};

export const EditModelButton: FC<PropsType> = ({ model }) => {
  const router = useRouter();
  const [state, formAction] = useFormState(editModel, null);
  
  const { data: types } = useSWR("/api/type", typesFetcher);

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
              action={(formData) => {
                formData.append("modelId", String(model.id));
                formAction(formData);
              }}
              className="flex justify-center items-center flex-col w-[321px] gap-3"
            >
              <h5 className="md:self-start self-center text-base uppercase">
                Отредактировать модель
              </h5>

              <Input
                type="text"
                id="name"
                placeholder="Название*"
                required
                fullWidth
                name="name"
                defaultValue={model.name}
              />

              {types && (
                <Select
                  name="type"
                  id="type"
                  defaultValue={String(model.typeId ?? "")}
                  className="w-full"
                  required
                >
                  {types.map((type) => (
                    <option value={String(type.id)} key={type.id}>{type.name}</option>
                  ))}
                </Select>
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
