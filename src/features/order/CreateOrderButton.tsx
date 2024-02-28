"use client";

import { OrderForm } from "@/entities/order/ui/OrderForm";
import { AddButton, Modal } from "@/shared";
import { useState } from "react";
import { createPortal } from "react-dom";

export const CreateOrderButton = () => {
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const onClose = () => {
    setIsOpenedModal(false);
  };

  const onSubmitActions = async (args: any) => {
    await fetch("/api/order", {
      body: JSON.stringify(args),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <>
      <div className="flex items-center justify-center rounded-md shadow-md w-[140px]">
        <AddButton onClick={handleModal} />
      </div>

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <OrderForm
              formTitle="Создать заказ"
              submitTitle="Создать"
              onClose={onClose}
              onSubmitAction={onSubmitActions}
            />
          </Modal>,
          document.body
        )}
    </>
  );
};
