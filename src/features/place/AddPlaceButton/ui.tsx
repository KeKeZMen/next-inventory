"use client";

import { AddButton, Button, Input, Modal } from "@/shared";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal, useFormState } from "react-dom";
import toast from "react-hot-toast";
import { addPlace } from "./lib";

export const AddPlaceButton = () => {
  const [state, formAction] = useFormState(addPlace, null);
  const router = useRouter();

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
              className="flex justify-center items-center flex-col w-[321px] gap-3"
              action={formAction}
            >
              <h5 className="md:self-start self-center text-base uppercase">
                Добавить площадку
              </h5>

              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Название*"
                required
                fullWidth
              />

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
