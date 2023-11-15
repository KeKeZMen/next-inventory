import { FC } from "react";
import { Button } from "./Button";

type PropsType = {
  onDelete: () => void;
  onClose: () => void;
};

export const DeleteConfirm: FC<PropsType> = ({ onDelete, onClose }) => {
  return (
    <div className="flex flex-col">
      <div className="self-center flex items-center mb-3">
        <img src="/warning.svg" alt="" className="mr-5" />
        <p className="uppercase font-bold">
          Действительно хотите удалить элемент?
        </p>
      </div>
      <div className="flex justify-between mt-5">
        <Button onClick={onClose}>Отмена</Button>

        <Button danger onClick={onDelete}>
          Удалить
        </Button>
      </div>
    </div>
  );
};
