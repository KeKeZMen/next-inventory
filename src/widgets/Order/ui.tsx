"use client";

import { DeleteButton, EditButton, Modal } from "@/shared";
import clsx from "clsx";
import { FC, useState } from "react";
import { createPortal, useFormState } from "react-dom";
import { deleteOrder, editOrder } from "./lib";

type PropsType = {
  order: {
    isDone: boolean;
    place: {
      name: string;
      id: number;
    };
    id: number;
    placeId: number;
    createdAt: Date;
    orderItems: {
      count: number;
      consumable: {
        name: string;
        count: number;
        id: number;
      };
      id: number;
    }[];
  };
  consumables: {
    id: number;
    name: string;
    required: boolean;
    count: number;
  }[];
};

export const Order: FC<PropsType> = ({ order, consumables }) => {
  const [state, formAction] = useFormState(editOrder, null);

  const [selectedConsumables, setSelectedConsumables] = useState(
    consumables.filter((c) =>
      order.orderItems.map((sc) => sc.consumable.id).includes(c.id)
    )
  );
  const [notSelectedConsumables, setNotSelectedConsumables] = useState(
    consumables.filter(
      (c) => !order.orderItems.map((sc) => sc.consumable.id).includes(c.id)
    )
  );

  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => {
    setIsOpenedModal((prev) => !prev);
  };

  const handleDeleteOrder = async () => {
    await deleteOrder(order.id);
  };

  return (
    <>
      <div
        className={clsx(
          "flex flex-col shadow-md rounded-md p-3 w-[200px]",
          order.isDone && "border-[#59CB4F] bg-[#DBFFD8]"
        )}
      >
        <div className="flex flex-col gap-2">
          <p className="text-2xl uppercase">В {order.place?.name}</p>
          <p>
            Создан {order.createdAt.getDate()}.{order.createdAt.getMonth()}.
            {order.createdAt.getFullYear()}
          </p>
        </div>
        <div className="flex justify-end items-center">
          <EditButton onClick={handleModal} />
          <DeleteButton onClick={handleDeleteOrder} />
        </div>
      </div>

      {isOpenedModal &&
        createPortal(
          <Modal onClose={handleModal}>
            <form
              action={(formData) => {
                formData.append(
                  "consumables",
                  JSON.stringify([
                    ...selectedConsumables.map((c) => ({
                      id: c.id,
                      count: c.count,
                    })),
                  ])
                );
                formData.append("orderId", String(order.id))
                formAction(formData);
              }}
            >
              <input type="checkbox" name="isDone" />
              <div className="flex gap-3">
                <div className="flex flex-col border">
                  {selectedConsumables.map((c) => (
                    <div
                      className="flex justify-between items-center gap-3 p-3 border-b last:border-none"
                      key={c.id}
                    >
                      <p>
                        {c.name}: {c.count}
                      </p>
                      <button
                        onClick={() => {
                          if (c.count <= 1) {
                            setSelectedConsumables((prev) =>
                              prev.filter((el) => el.id !== c.id)
                            );
                            return setNotSelectedConsumables((prev) => [
                              ...prev,
                              c,
                            ]);
                          }
                          setSelectedConsumables((prev) => [
                            ...prev.map((el) =>
                              el.id == c.id ? { ...c, count: c.count - 1 } : el
                            ),
                          ]);
                        }}
                        type="button"
                      >
                        -
                      </button>
                      <button
                        onClick={() =>
                          setSelectedConsumables((prev) => [
                            ...prev.map((el) =>
                              el.id == c.id && el.count < c.count ? { ...c, count: c.count + 1 } : el
                            ),
                          ])
                        }
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col border">
                  {notSelectedConsumables.map((c) => (
                    <div
                      className="flex justify-between items-center gap-3 p-3 border-b last:border-none"
                      key={c.id}
                    >
                      <p>{c.name}: {c.count}</p>
                      <button
                        onClick={() => {
                          setSelectedConsumables((prev) => [
                            ...prev,
                            { ...c, count: 1 },
                          ]);
                          setNotSelectedConsumables((prev) =>
                            prev.filter((el) => el.id !== c.id)
                          );
                        }}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit">Редактировать</button>
            </form>
          </Modal>,
          document.body
        )}
    </>
  );
};
