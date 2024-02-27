"use client";

import { ConsumableForm } from "@/entities/consumable/ui/ConsumableForm";
import { AddButton, Modal } from "@/shared";
import { useState } from "react";
import { createPortal } from "react-dom";

export const AddConsumableButton = () => {
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const onClose = () => {
    setIsOpenedModal(false);
  };

  const onSubmitActions = async (args: any) => {
    await fetch("/api/consumable", {
      body: JSON.stringify(args),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <>
      <AddButton onClick={handleModal} />

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <ConsumableForm
              formTitle="Создать расходник"
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
