"use client";

import { RightForm } from "@/entities/right/ui/RightForm";
import { AddButton, Modal } from "@/shared";
import { useState } from "react";
import { createPortal } from "react-dom";

export const AddRightButton = () => {
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const onClose = () => {
    setIsOpenedModal(false);
  };

  const onSubmitActions = async (args: any) => {
    await fetch("/api/right", {
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
            <RightForm
              formTitle="Создать права"
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
