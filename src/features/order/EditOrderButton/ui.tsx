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
import { editOrder } from "./lib";
import toast from "react-hot-toast";
import useSWR, { Fetcher } from "swr";
import { IPlace } from "@/entities/place/lib/types";
import { OrderingConsumable } from "@/entities/consumable/ui/OrderingConsumable";

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
    }[];
  };
  consumables: {
    id: number;
    name: string;
    count: number;
  }[];
  isAdmin?: boolean;
};

const placesFetcher: Fetcher<Array<IPlace>, string> = (url) =>
  fetch(url).then((res) => res.json());

export const EditOrderButton: FC<PropsType> = ({
  order,
  consumables,
  isAdmin,
}) => {
  const { data: places } = useSWR("/api/place", placesFetcher);
  const [state, formAction] = useFormState(editOrder, null);
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);

  const onClose = () => {
    setIsOpenedModal(false);
  };

  const [selectedPlaceId, setSelectedPlaceId] = useState(
    order ? String(order.placeId) : ""
  );
  const handleSelectPlace = (value: string) => {
    setSelectedPlaceId(value);
  };

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

  useEffect(() => {
    if (state?.data?.message) {
      toast.success(state?.data?.message);
    } else if (state?.error?.message) {
      toast.error(state?.error?.message);
    }
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
                formData.append("placeId", selectedPlaceId);
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
              <h5 className="md:self-start self-center text-base uppercase">
                Отредактировать заказ
              </h5>

              {places && (
                <Select
                  options={places.map((place) => ({
                    label: place.name,
                    value: String(place.id),
                  }))}
                  onChange={handleSelectPlace}
                  selected={selectedPlaceId}
                  placeholder="Площадка назначения*"
                  fullwidth
                />
              )}

              <div className="flex justify-between gap-1 w-full">
                <DataTable title="Выбранные">
                  {selectedConsumables.map((consumable) => (
                    <OrderingConsumable
                      key={`selected-${consumable.id}`}
                      consumable={consumable}
                      orderActions={
                        <>
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
                          <button
                            onClick={() => {
                              const indexOfConsumable = consumables.findIndex(
                                (consumables) => consumables.id == consumable.id
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
                        </>
                      }
                    />
                  ))}
                </DataTable>

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
              </div>

              {isAdmin && (
                <Checkbox
                  name="isDone"
                  defaultChecked={order?.isDone}
                  label="Готов"
                />
              )}

              <div className="flex self-end justify-between items-center w-full">
                <Button onClick={onClose} danger type="button">
                  Отменить
                </Button>

                <Button type="submit" disabled={order.isDone}>
                  Отредактировать
                </Button>
              </div>
            </form>
          </Modal>,
          document.body
        )}
    </>
  );
};
