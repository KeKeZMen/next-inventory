"use client";

import { DeleteButton, DeleteConfirm, Modal } from "@/shared";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { createPortal } from "react-dom";

type PropsType = {
  rightId: number;
};

export const DeleteRightButton: FC<PropsType> = ({ rightId }) => {
  const router = useRouter();
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const onDelete = async (rightId: number) => {
    await fetch("/api/right", {
      method: "DELETE",
      body: JSON.stringify(rightId),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleDeleteRight = () => {
    onDelete(rightId);
    setIsOpenedModal(false);
    router.refresh();
  };

  return (
    <>
      <DeleteButton onClick={handleModal} />

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <DeleteConfirm onClose={handleModal} onDelete={handleDeleteRight} />
          </Modal>,
          document.body
        )}
    </>
  );
};
