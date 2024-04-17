"use client";

import { SortSelect } from "@/features/sort/SortSelect";
import { TypeSelect } from "@/features/type/TypeSelect";
import { Button, Modal, useWindowSize } from "@/shared";
import { FC, useState } from "react";
import { createPortal } from "react-dom";

type PropsType = {
  typeSelect?: boolean;
  sortSelect?: boolean;
};

export const ProductsSelects: FC<PropsType> = ({ sortSelect, typeSelect }) => {
  const { width } = useWindowSize();
  const [isOpenedModal, setIsOpenedModal] = useState(false);

  const handleModal = () => setIsOpenedModal((prev) => !prev);

  if (width && width >= 640) {
    return (
      <>
        {typeSelect && <TypeSelect />}
        {sortSelect && <SortSelect />}
      </>
    );
  } else {
    return (
      <>
        <Button onClick={handleModal}>Фильтр</Button>

        {isOpenedModal &&
          createPortal(
            <Modal onClose={handleModal}>
              <div className="flex flex-col gap-5">
                {typeSelect && <TypeSelect />}
                {sortSelect && <SortSelect />}
              </div>
            </Modal>,
            document.body
          )}
      </>
    );
  }
};
