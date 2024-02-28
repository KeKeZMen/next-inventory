"use client";

import { IConsumable } from "@/entities/consumable/lib/types";
import { IOrder } from "@/entities/order/lib/types";
import { OrderForm } from "@/entities/order/ui/OrderForm";
import { DataTable, EditButton, Modal } from "@/shared";
import { useState, FC } from "react";
import { createPortal } from "react-dom";
import useSWR, { Fetcher } from "swr";
import { AddToOrderButton } from "../orderItem/AddToOrderButton";
import { IOrderItem } from "@/entities/orderItem/lib/types";
import { OrderItemRow } from "@/entities/orderItem/ui/OrderItemRow";
import { DeleteFromOrderButton } from "../orderItem/DeleteFromOrderButton";
import { CountEdit } from "../orderItem/CountEdit";
import { OrderingConsumable } from "@/entities/consumable/ui/OrderingConsumable";

type PropsType = {
  order: IOrder;
};

const consumablesFetcher: Fetcher<Array<IConsumable>, string> = (url) =>
  fetch(url).then((res) => res.json());

const orderItemsFetcher: Fetcher<Array<IOrderItem>, string> = (url) =>
  fetch(url).then((res) => res.json());

export const EditOrderButton: FC<PropsType> = ({ order }) => {
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const onClose = () => {
    setIsOpenedModal(false);
  };

  const { data: consumables } = useSWR("/api/consumable", consumablesFetcher);
  const { data: orderItems } = useSWR(
    `/api/order/${order.id}`,
    orderItemsFetcher
  );

  const onSubmitActions = async (args: any) => {
    await fetch("/api/order", {
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
            <OrderForm
              onClose={onClose}
              onSubmitAction={onSubmitActions}
              formTitle="Редактировать заказ"
              submitTitle="Редактировать"
              order={order}
              consumables={
                <DataTable title="В наличии">
                  {consumables?.map((consumable) => (
                    <OrderingConsumable
                      consumable={consumable}
                      addToOrderButton={
                        <AddToOrderButton
                          consumableId={consumable.id}
                          orderId={order.id}
                        />
                      }
                    />
                  ))}
                </DataTable>
              }
              orderItems={
                <DataTable title="Выбранные">
                  {orderItems &&
                    consumables &&
                    orderItems.map((orderItem) => (
                      <OrderItemRow
                        itemsCountButton={
                          <CountEdit
                            orderItem={orderItem}
                            maxCount={
                              consumables?.filter(
                                (consumable) =>
                                  consumable.id == orderItem.consumableId
                              )[0].count
                            }
                          />
                        }
                        orderItem={orderItem}
                        deleteFormOrderButton={
                          <DeleteFromOrderButton orderItemId={orderItem.id} />
                        }
                      />
                    ))}
                </DataTable>
              }
            />
          </Modal>,
          document.body
        )}
    </>
  );
};
