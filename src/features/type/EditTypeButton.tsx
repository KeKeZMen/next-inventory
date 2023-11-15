"use client";

import { IType } from "@/entities/type/lib/types";
import { TypeForm } from "@/entities/type/ui/TypeForm";
import { EditButton, Modal } from "@/shared";
import { useState, FC } from "react";
import { createPortal } from "react-dom";

type PropsType = {
  type: IType;
};

export const EditTypeButton: FC<PropsType> = ({ type }) => {
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const onClose = () => {
    setIsOpenedModal(false);
  };

  const onSubmitActions = async (args: any) => {
    await fetch("/api/type", {
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
            <TypeForm
              onClose={onClose}
              onSubmitAction={onSubmitActions}
              formTitle="Редактировать тип"
              submitTitle="Редактировать"
              type={type}
            />
          </Modal>,
          document.body
        )}
    </>
  );
};
