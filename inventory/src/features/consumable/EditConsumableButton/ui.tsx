"use client";

import { modelsFetcher } from "@/entities/model/api";
import { Button, Checkbox, EditButton, Input, Modal } from "@/shared";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, FC } from "react";
import { createPortal, useFormState } from "react-dom";
import toast from "react-hot-toast";
import useSWR from "swr";
import { editConsumable } from "./api";
import { IConsumableWithModels } from "@/shared/lib/typecode";

type PropsType = {
  consumable: IConsumableWithModels
}

export const EditConsumableButton: FC<PropsType> = ({ consumable }) => {
  const [state, formAction] = useFormState(editConsumable, null);
  const router = useRouter();
  const params = useParams();

  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);
  const onClose = () => {
    setIsOpenedModal(false);
  };

  const { data: models } = useSWR(`/api/model/${params.typeId}`, modelsFetcher);
  const [selectedModels, setSelectedModels] = useState<Array<string>>(
    consumable?.models?.map((model) => String(model.id)) ?? []
  );
  const handleSelectModel = (value: string) => {
    if (selectedModels.includes(value))
      setSelectedModels((prev) => [...prev.filter((p) => p !== value)]);
    else setSelectedModels((prev) => [...prev, value]);    
  };

  useEffect(() => {
    if (state?.data?.message) {
      toast.success(state.data.message);
      router.refresh();
    } else if (state?.error?.message) {
      toast.error(state.error.message);
    }
    onClose();
  }, [state]);

  return (
    <>
      <EditButton onClick={handleModal} />

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <form
              className="flex justify-center items-center flex-col w-[321px] gap-3"
              action={(formData) => {
                formData.append("models", selectedModels.join(","));
                formData.append("consumableId", String(consumable.id));
                formAction(formData);
              }}
            >
              <h5 className="md:self-start self-center text-base uppercase">
                Отредактировать расходник
              </h5>

              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Название*"
                required
                defaultValue={consumable.name}
                fullWidth
              />

              <Input
                type="number"
                id="count"
                name="count"
                placeholder="Количество*"
                required
                defaultValue={consumable.count}
                fullWidth
              />

              <div className="w-full h-[200px] overflow-y-auto">
                {models?.map((model) => (
                  <Checkbox
                    key={`edit-${consumable.id}-${model.id}`}
                    id={`${model.id}`}
                    label={`${model.name}`}
                    defaultChecked={selectedModels?.includes(String(model.id))}
                    value={model.id}
                    onChange={(e) => handleSelectModel(e.target.value)}
                  />
                ))}
              </div>

              <div className="flex self-end justify-between items-center w-full type">
                <Button onClick={onClose} danger>
                  Отменить
                </Button>

                <Button type="submit">Отредактировать</Button>
              </div>
            </form>
          </Modal>,
          document.body
        )}
    </>
  );
};
