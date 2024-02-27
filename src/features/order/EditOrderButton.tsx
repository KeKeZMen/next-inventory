"use client";

import { IOrder } from "@/entities/order/lib/types";
import { OrderForm } from "@/entities/order/ui/OrderForm";
import { EditButton, Modal } from "@/shared";
import { useState, FC } from "react";
import { createPortal } from "react-dom";

type PropsType = {
  order: IOrder;
};

export const EditOrderButton: FC<PropsType> = ({ order }) => {
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const onClose = () => {
    setIsOpenedModal(false);
  };

  const onSubmitActions = async (args: any) => {
    await fetch("/api/order", {
      body: JSON.stringify(args),
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <>
      <EditButton onClick={handleModal} />

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <OrderForm
              onClose={onClose}
              onSubmitAction={onSubmitActions}
              formTitle="Редактировать заказ"
              submitTitle="Редактировать"
              order={order}
            />
          </Modal>,
          document.body
        )}
    </>
  );
};
