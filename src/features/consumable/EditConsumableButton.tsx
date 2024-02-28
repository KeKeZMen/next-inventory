"use client";

import { IConsumable } from "@/entities/consumable/lib/types";
import { ConsumableForm } from "@/entities/consumable/ui/ConsumableForm";
import { EditButton, Modal } from "@/shared";
import { useState, FC } from "react";
import { createPortal } from "react-dom";

type PropsType = {
  consumable: IConsumable;
};

export const EditConsumableButton: FC<PropsType> = ({ consumable }) => {
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const onClose = () => {
    setIsOpenedModal(false);
  };

  const onSubmitActions = async (args: any) => {
    await fetch("/api/consumable", {
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
            <ConsumableForm
              onClose={onClose}
              onSubmitAction={onSubmitActions}
              formTitle="Редактировать расходник"
              submitTitle="Редактировать"
              consumable={consumable}
            />
          </Modal>,
          document.body
        )}
    </>
  );
};
