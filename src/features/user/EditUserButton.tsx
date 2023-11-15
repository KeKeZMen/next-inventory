"use client";

import { UserForm } from "@/entities/user/ui/UserForm";
import { EditButton, Modal } from "@/shared";
import { User } from "next-auth";
import { useState, FC } from "react";
import { createPortal } from "react-dom";

type PropsType = {
  user: User;
};

export const EditUserButton: FC<PropsType> = ({ user }) => {
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const onClose = () => {
    setIsOpenedModal(false);
  };

  const onSubmitActions = async (args: any) => {
    await fetch("/api/user", {
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
            <UserForm
              onClose={onClose}
              onSubmitAction={onSubmitActions}
              formTitle="Редактировать пользователя"
              submitTitle="Редактировать"
              user={user}
            />
          </Modal>,
          document.body
        )}
    </>
  );
};
