"use client";

import {
  AddButton,
  Button,
  Checkbox,
  DataTable,
  Modal,
  Select,
} from "@/shared";
import { FC, useEffect, useState } from "react";
import { createPortal, useFormState } from "react-dom";
import { createOrder } from "./lib";
import toast from "react-hot-toast";
import useSWR from "swr";
import { OrderingConsumable } from "@/entities/consumable/ui/OrderingConsumable";
import { placesFetcher } from "@/entities/place/api";
import { OrderingConsumableType } from "@/shared/lib/typecode";
import { useRouter } from "next/navigation";

type PropsType = {
  consumables: Array<OrderingConsumableType>
  isAdmin?: boolean;
};

export const CreateOrderButton: FC<PropsType> = ({ consumables, isAdmin }) => {
  const router = useRouter();
  const [state, formAction] = useFormState(createOrder, null);

  const { data: places } = useSWR("/api/place", placesFetcher);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const handleSelectPlace = (value: string) => {
    setSelectedPlaceId(value);
  };

  const [selectedConsumables, setSelectedConsumables] = useState<
  typeof consumables
  >([]);
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
      router.refresh()
    } else if (state?.error?.message) {
      toast.error(state?.error?.message);
    }
    onClose()
  }, [state]);

  useEffect(() => {
    setNotSelectedConsumables(
      consumables.filter(
        (consumable) =>
          !selectedConsumables
            .map((selectedConsumable) => selectedConsumable.id)
            .includes(consumable.id) && consumable.count > 1
      )
    );
  }, [selectedConsumables]);

  return (
    <>
      <div className="flex items-center justify-center rounded-md shadow-md w-full md:w-[200px] h-[112px]">
        <AddButton onClick={handleModal} />
      </div>

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <form
              action={(formData) => {
                formData.append("placeId", selectedPlaceId);
                formData.append(
                  "consumables",
                  JSON.stringify([
                    ...selectedConsumables.map((c) => ({
                      id: c.id,
                      count: c.count,
                    })),
                  ])
                );
                formAction(formData);
                setSelectedConsumables([]);
                setSelectedPlaceId("");
                onClose?.();
              }}
              className="flex justify-center items-center flex-col md:min-w-[800px] gap-3"
            >
              <h5 className="md:self-start self-center text-base uppercase">
                Создать заказ
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

              <div className="flex flex-col justify-between gap-1 w-full md:flex-row">
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
                      key={`cons-${consumable.id}`}
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

              {isAdmin && <Checkbox name="isDone" label="Готов" />}

              <div className="flex self-end justify-between items-center w-full">
                <Button onClick={onClose} danger type="button">
                  Отменить
                </Button>

                <Button type="submit">Создать</Button>
              </div>
            </form>
          </Modal>,
          document.body
        )}
    </>
  );
};
