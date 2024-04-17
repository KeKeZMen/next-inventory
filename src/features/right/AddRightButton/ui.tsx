"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AddButton, Button, Input, Modal } from "@/shared";
import { Checkbox } from "@/shared/ui/Checkbox";
import { useFormState, createPortal } from "react-dom";
import { addRight } from "./api";

export const AddRightButton: FC = () => {
  const [state, formAction] = useFormState(addRight, null);
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
              action={formAction}
              className="flex justify-center items-center flex-col w-[321px]"
            >
              <h5 className="md:self-start self-center text-base uppercase mb-[10px]">
                Добавить права
              </h5>

              <Input
                type="text"
                id="name"
                placeholder="Название*"
                required
                fullWidth
                name="name"
              />

              <Checkbox
                id="placeActions"
                label="Площадки"
                margin="10px 0"
                name="placeActions"
              />

              <Checkbox
                id="productActions"
                label="Продукты"
                margin="10px 0"
                name="productActions"
              />

              <Checkbox
                id="rightActions"
                label="Права"
                margin="10px 0"
                name="rightActions"
              />

              <Checkbox
                id="typeActions"
                label="Типы"
                margin="10px 0"
                name="typeActions"
              />

              <Checkbox
                id="userActions"
                label="Пользователи"
                margin="10px 0"
                name="userActions"
              />

              <Checkbox
                id="cabinetActions"
                label="Кабинеты"
                margin="10px 0"
                name="cabinetActions"
              />

              <Checkbox
                id="consumablesActions"
                label="Расходники"
                margin="10px 0"
                name="consumablesActions"
              />

              <Checkbox
                id="orderSuccesing"
                label="Подтверждение заказов"
                margin="10px 0"
                name="orderSuccesing"
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
