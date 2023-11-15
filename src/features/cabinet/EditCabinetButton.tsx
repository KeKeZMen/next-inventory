"use client";

import { ICabinet } from "@/entities/cabinet/lib/types";
import { CabinetForm } from "@/entities/cabinet/ui/CabinetForm";
import { EditButton, Modal } from "@/shared";
import { useState, FC } from "react";
import { createPortal } from "react-dom";

type PropsType = {
  cabinet: ICabinet;
};

export const EditCabinetButton: FC<PropsType> = ({ cabinet }) => {
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const onClose = () => {
    setIsOpenedModal(false);
  };

  const onSubmitActions = async (args: any) => {
    await fetch("/api/cabinet", {
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
            <CabinetForm
              onClose={onClose}
              onSubmitAction={onSubmitActions}
              formTitle="Редактировать кабинет"
              submitTitle="Редактировать"
              cabinet={cabinet}
            />
          </Modal>,
          document.body
        )}
    </>
  );
};
