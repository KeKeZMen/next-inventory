"use client";

import { useRouter } from "next/navigation";
import { useState, FC, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button, EditButton, Input, Modal } from "@/shared";
import { useFormState, createPortal } from "react-dom";
import { editType } from "./api";
import type { Type } from "@prisma/client";

type PropsType = {
  type: Type;
};

export const EditTypeButton: FC<PropsType> = ({ type }) => {
  const router = useRouter();
  const [state, formAction] = useFormState(editType, null);

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
                formData.append("typeId", String(type.id));
                formAction(formData);
              }}
              className="flex justify-center items-center flex-col w-[321px] gap-3"
            >
              <h5 className="md:self-start self-center text-base uppercase">
                Отредактировать тип
              </h5>

              <Input
                type="text"
                id="name"
                placeholder="Название*"
                required
                fullWidth
                name="name"
                defaultValue={type.name}
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
