"use client";

import { FC, useState } from "react";
import { DeleteButton, DeleteConfirm, Modal } from "@/shared";
import { createPortal } from "react-dom";
import { deleteOrder } from "./lib";

type PropsType = {
  orderId: number;
};

export const DeleteOrderButton: FC<PropsType> = ({ orderId }) => {
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const handleDeleteOrder = async () => {
    await deleteOrder(orderId);
    handleModal()
  };

  return (
    <>
      <DeleteButton onClick={handleModal} />

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <DeleteConfirm onClose={handleModal} onDelete={handleDeleteOrder} />
          </Modal>,
          document.body
        )}
    </>
  );
};
