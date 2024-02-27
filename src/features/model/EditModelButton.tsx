"use client";

import { IModel } from "@/entities/model/lib/types";
import { ModelForm } from "@/entities/model/ui/ModelForm";
import { EditButton, Modal } from "@/shared";
import { useState, FC } from "react";
import { createPortal } from "react-dom";

type PropsType = {
  model: IModel;
};

export const EditModelButton: FC<PropsType> = ({ model }) => {
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const onClose = () => {
    setIsOpenedModal(false);
  };

  const onSubmitActions = async (args: any) => {
    await fetch("/api/model", {
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
            <ModelForm
              onClose={onClose}
              onSubmitAction={onSubmitActions}
              formTitle="Редактировать модель"
              submitTitle="Редактировать"
              model={model}
            />
          </Modal>,
          document.body
        )}
    </>
  );
};
