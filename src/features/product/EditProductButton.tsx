"use client";

import { IProduct } from "@/entities/product/lib/types";
import { ProductForm } from "@/entities/product/ui/ProductForm";
import { EditButton, Modal } from "@/shared";
import { useState, FC } from "react";
import { createPortal } from "react-dom";

type PropsType = {
  product: IProduct;
};

export const EditProductButton: FC<PropsType> = ({ product }) => {
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const onClose = () => {
    setIsOpenedModal(false);
  };

  const onSubmitActions = async (args: any) => {
    await fetch("/api/product", {
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
            <ProductForm
              onClose={onClose}
              onSubmitAction={onSubmitActions}
              formTitle="Редактировать продукт"
              submitTitle="Редактировать"
              product={product}
            />
          </Modal>,
          document.body
        )}
    </>
  );
};
