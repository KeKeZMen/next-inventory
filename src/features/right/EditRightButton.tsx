"use client"

import { IRight } from "@/entities/right/lib/types";
import { RightForm } from "@/entities/right/ui/RightForm";
import { EditButton, Modal } from "@/shared";
import { useState, FC } from "react";
import { createPortal } from "react-dom";

type PropsType = {
  right: IRight;
};

export const EditRightButton: FC<PropsType> = ({ right }) => {
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const onClose = () => {
    setIsOpenedModal(false);
  };

  const onSubmitActions = async (args: any) => {
    await fetch("/api/right", {
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
            <RightForm
              onClose={onClose}
              onSubmitAction={onSubmitActions}
              formTitle="Редактировать права"
              submitTitle="Редактировать"
              right={right}
            />
          </Modal>,
          document.body
        )}
    </>
  );
};
