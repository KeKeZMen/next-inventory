"use client";

import {
  Button,
  Checkbox,
  DataTable,
  EditButton,
  Modal,
  Select,
} from "@/shared";
import { FC, useEffect, useState } from "react";
import { createPortal, useFormState } from "react-dom";
import { editOrder } from "./api";
import toast from "react-hot-toast";
import useSWR from "swr";
import { OrderingConsumable } from "@/entities/consumable/ui/OrderingConsumable";
import { placesFetcher } from "@/entities/place/api";
import {
  IOrderWithOrderItemsAndPlace,
  OrderingConsumableType,
} from "@/shared/lib/typecode";
import { useRouter } from "next/navigation";

type PropsType = {
  order: IOrderWithOrderItemsAndPlace;
  consumables: Array<OrderingConsumableType>;
  canSuccess?: boolean;
};

export const EditOrderButton: FC<PropsType> = ({
  order,
  consumables,
  canSuccess,
}) => {
  const router = useRouter();
  const [state, formAction] = useFormState(editOrder, null);

  const { data: places } = useSWR("/api/place", placesFetcher);

  const [selectedConsumables, setSelectedConsumables] = useState(
    order.orderItems.map((orderItem) => ({
      id: orderItem.consumable.id,
      name: orderItem.consumable.name,
      count: orderItem.count,
    }))
  );
  const [notSelectedConsumables, setNotSelectedConsumables] = useState<
    typeof consumables
  >([]);

  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);
  const onClose = () => {
    setIsOpenedModal(false);
  };

  useEffect(() => {
    if (state?.data?.message) {
      toast.success(state?.data?.message);
      router.refresh();
    } else if (state?.error?.message) {
      toast.error(state?.error?.message);
    }
    onClose();
  }, [state]);

  useEffect(() => {
    setNotSelectedConsumables(
      consumables.filter(
        (consumable) =>
          !selectedConsumables
            .map((selectedConsumable) => selectedConsumable.id)
            .includes(consumable.id) && consumable.count > 0
      )
    );
  }, [selectedConsumables]);

  return (
    <>
      <EditButton onClick={handleModal} />

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <form
              action={(formData) => {
                formData.append("orderId", String(order.id));
                formData.append(
                  "consumables",
                  JSON.stringify([
                    ...selectedConsumables.map((consumable) => ({
                      id: consumable.id,
                      count: consumable.count,
                    })),
                  ])
                );
                formAction(formData);
                onClose?.();
              }}
              className="flex justify-center items-center flex-col md:min-w-[800px] gap-3"
            >
              {!order.isDone && (
                <h5 className="md:self-start self-center text-base uppercase">
                  Отредактировать заказ
                </h5>
              )}

              {!order.isDone ? (
                places && (
                  <Select
                    name="place"
                    id="place"
                    defaultValue={order.placeId ?? ""}
                    className="w-full"
                    required
                  >
                    {places.map((place) => (
                      <option value={String(place.id)} key={place.id}>
                        {place.name}
                      </option>
                    ))}
                  </Select>
                )
              ) : (
                <h5 className="md:self-center self-center text-base uppercase">
                  Отправлено в {order.place.name}
                </h5>
              )}

              <div className="flex flex-col justify-between gap-1 w-full md:flex-row">
                <DataTable title="Выбранные">
                  {selectedConsumables.map((consumable) => (
                    <OrderingConsumable
                      key={`selected-${consumable.id}`}
                      consumable={consumable}
                      orderActions={
                        <>
                          {!order.isDone && (
                            <button
                              onClick={() => {
                                if (consumable.count <= 1) {
                                  setSelectedConsumables((prev) =>
                                    [...prev].filter(
                                      (selectedConsumable) =>
                                        selectedConsumable.id !== consumable.id
                                    )
                                  );
                                } else {
                                  setSelectedConsumables((prev) =>
                                    [...prev].map((selectedConsumable) =>
                                      selectedConsumable.id == consumable.id
                                        ? {
                                            count: consumable.count - 1,
                                            id: consumable.id,
                                            name: consumable.name,
                                          }
                                        : selectedConsumable
                                    )
                                  );
                                }
                              }}
                              type="button"
                            >
                              -
                            </button>
                          )}
                          {!order.isDone && (
                            <button
                              onClick={() => {
                                const indexOfConsumable = consumables.findIndex(
                                  (consumables) =>
                                    consumables.id == consumable.id
                                );
                                if (indexOfConsumable == -1)
                                  return toast.error(`Элемент не найден`);

                                const maxCount =
                                  consumables[indexOfConsumable].count;
                                if (consumable.count < maxCount) {
                                  setSelectedConsumables((prev) =>
                                    [...prev].map((selectedConsumable) =>
                                      selectedConsumable.id == consumable.id
                                        ? {
                                            count: consumable.count + 1,
                                            id: consumable.id,
                                            name: consumable.name,
                                          }
                                        : selectedConsumable
                                    )
                                  );
                                } else {
                                  toast.error(
                                    `Невозможно выбрать больше чем ${maxCount}`
                                  );
                                }
                              }}
                              type="button"
                            >
                              +
                            </button>
                          )}
                        </>
                      }
                    />
                  ))}
                </DataTable>

                {!order.isDone && (
                  <DataTable title="В наличии">
                    {notSelectedConsumables.map((consumable) => (
                      <OrderingConsumable
                        consumable={consumable}
                        key={`noselected-${consumable.id}`}
                        orderActions={
                          <button
                            onClick={() => {
                              setSelectedConsumables((prev) => [
                                ...prev,
                                {
                                  count: 1,
                                  id: consumable.id,
                                  name: consumable.name,
                                },
                              ]);
                            }}
                            type="button"
                          >
                            +
                          </button>
                        }
                      />
                    ))}
                  </DataTable>
                )}
              </div>

              {canSuccess && !order.isDone && (
                <Checkbox
                  name="isDone"
                  defaultChecked={order?.isDone}
                  label="Готов"
                />
              )}

              <div className="flex self-end justify-between items-center w-full">
                <Button onClick={onClose} danger type="button">
                  {!order.isDone ? "Отменить" : "Закрыть"}
                </Button>

                {!order.isDone && (
                  <Button type="submit" disabled={order.isDone}>
                    Отредактировать
                  </Button>
                )}
              </div>
            </form>
          </Modal>,
          document.body
        )}
    </>
  );
};
