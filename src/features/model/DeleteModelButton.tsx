"use client";

import { FC, useState } from "react";
import { DeleteButton, DeleteConfirm, Modal } from "@/shared";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createPortal } from "react-dom";

type PropsType = {
  modelId: number;
};

export const DeleteModelButton: FC<PropsType> = ({ modelId }) => {
  const router = useRouter();
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const onDelete = async (modelId: number) => {
    try {
      const res = await fetch(`/api/model`, {
        body: JSON.stringify({ modelId }),
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) return toast.error((await res.json()).message);

      toast.success((await res.json()).message);
      return router.refresh();
    } catch (error) {
      return toast.error("Ошибка сервера");
    }
  };

  const handleDeleteModel = () => {
    onDelete(modelId);
    setIsOpenedModal(false);
    router.refresh();
  };

  return (
    <>
      <DeleteButton onClick={handleModal} />

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <DeleteConfirm onClose={handleModal} onDelete={handleDeleteModel} />
          </Modal>,
          document.body
        )}
    </>
  );
};
