"use client";

import { FC, useState } from "react";
import { DeleteButton, DeleteConfirm, Modal } from "@/shared";
import { createPortal } from "react-dom";
import { deleteOrder } from "./lib";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type PropsType = {
  orderId: number;
};

export const DeleteOrderButton: FC<PropsType> = ({ orderId }) => {
  const router = useRouter();
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const handleDelete = async () => {
    const res = await deleteOrder(orderId);
    if (res.data?.message) {
      toast.success(res.data.message);
      router.refresh();
    } else if (res.error?.message) {
      toast.error(res.error.message);
    }
    handleModal();
  };

  return (
    <>
      <DeleteButton onClick={handleModal} />

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <DeleteConfirm onClose={handleModal} onDelete={handleDelete} />
          </Modal>,
          document.body
        )}
    </>
  );
};
