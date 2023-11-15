"use client";

import { IPlace } from "@/entities/place/lib/types";
import { PlaceForm } from "@/entities/place/ui/PlaceForm";
import { EditButton, Modal } from "@/shared";
import { useState, FC } from "react";
import { createPortal } from "react-dom";

type PropsType = {
  place: IPlace;
};

export const EditPlaceButton: FC<PropsType> = ({ place }) => {
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const onClose = () => {
    setIsOpenedModal(false);
  };

  const onSubmitActions = async (args: any) => {
    await fetch("/api/place", {
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
            <PlaceForm
              onClose={onClose}
              onSubmitAction={onSubmitActions}
              formTitle="Редактировать тип"
              submitTitle="Редактировать"
              place={place}
            />
          </Modal>,
          document.body
        )}
    </>
  );
};
