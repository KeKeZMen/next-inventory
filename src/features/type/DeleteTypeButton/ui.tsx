"use client";

import { FC, useState } from "react";
import { DeleteButton, DeleteConfirm, Modal } from "@/shared";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createPortal } from "react-dom";
import { deleteType } from "./api";

type PropsType = {
  typeId: number;
};

export const DeleteTypeButton: FC<PropsType> = ({ typeId }) => {
  const router = useRouter();
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const handleDelete = async () => {
    const res = await deleteType(typeId);
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
