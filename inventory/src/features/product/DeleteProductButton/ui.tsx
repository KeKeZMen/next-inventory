"use client";

import { FC, useState } from "react";
import { DeleteButton, DeleteConfirm, Modal } from "@/shared";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createPortal } from "react-dom";
import { deleteProduct } from "./api";

type PropsType = {
  productId: number;
};

export const DeleteProductButton: FC<PropsType> = ({ productId }) => {
  const router = useRouter();
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const handleDelete = async () => {
    const res = await deleteProduct(productId);
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
