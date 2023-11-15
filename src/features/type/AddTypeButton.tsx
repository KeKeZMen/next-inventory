"use client";

import { TypeForm } from "@/entities/type/ui/TypeForm";
import { AddButton, Modal } from "@/shared";
import { useState } from "react";
import { createPortal } from "react-dom";

export const AddTypeButton = () => {
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const onClose = () => {
    setIsOpenedModal(false);
  };

  const onSubmitActions = async (args: any) => {
    await fetch("/api/type", {
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
            <TypeForm
              formTitle="Создать тип"
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
