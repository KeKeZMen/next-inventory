"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button, EditButton, Input, Modal } from "@/shared";
import { Checkbox } from "@/shared/ui/Checkbox";
import { useFormState, createPortal } from "react-dom";
import { editRight } from "./api";
import type { Right } from "@prisma/client";

type PropsType = {
  right: Right;
};

export const EditRightButton: FC<PropsType> = ({ right }) => {
  const [state, formAction] = useFormState(editRight, null);
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
      <EditButton onClick={handleModal} />

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <form
              action={(formData) => {
                formData.append("rightId", String(right.id));
                formAction(formData);
              }}
              className="flex justify-center items-center flex-col w-[321px]"
            >
              <h5 className="md:self-start self-center text-base uppercase mb-[10px]">
                Отредактировать права
              </h5>

              <Input
                type="text"
                id="name"
                placeholder="Название*"
                required
                fullWidth
                name="name"
                defaultValue={right.name}
              />

              <Checkbox
                id="placeActions"
                label="Площадки"
                margin="10px 0"
                name="placeActions"
                defaultChecked={right.placeActions}
              />

              <Checkbox
                id="productActions"
                label="Продукты"
                margin="10px 0"
                name="productActions"
                defaultChecked={right.productActions}
              />

              <Checkbox
                id="rightActions"
                label="Права"
                margin="10px 0"
                name="rightActions"
                defaultChecked={right.rightActions}
              />

              <Checkbox
                id="typeActions"
                label="Типы"
                margin="10px 0"
                name="typeActions"
                defaultChecked={right.typeActions}
              />

              <Checkbox
                id="userActions"
                label="Пользователи"
                margin="10px 0"
                name="userActions"
                defaultChecked={right.userActions}
              />

              <Checkbox
                id="cabinetActions"
                label="Кабинеты"
                margin="10px 0"
                name="cabinetActions"
                defaultChecked={right.cabinetActions}
              />

              <Checkbox
                id="consumablesActions"
                label="Расходники"
                margin="10px 0"
                name="consumablesActions"
                defaultChecked={right.consumablesActions}
              />

              <Checkbox
                id="orderSuccesing"
                label="Подтверждение заказов"
                margin="10px 0"
                name="orderSuccesing"
                defaultChecked={right.orderSuccesing}
              />

              <Checkbox
                id="creatingOrders"
                label="Создание заказов"
                margin="10px 0"
                name="creatingOrders"
                defaultChecked={right.creatingOrders}
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
