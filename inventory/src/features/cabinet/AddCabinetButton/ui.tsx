"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, FC, useEffect } from "react";
import { AddButton, Button, Input, Modal, Select } from "@/shared";
import useSWR from "swr";
import { placesFetcher } from "@/entities/place/api";
import { usersFetcher } from "@/entities/user/api";
import { addCabinet } from "./api";
import { useFormState, createPortal } from "react-dom";
import toast from "react-hot-toast";

export const AddCabinetButton: FC = () => {
  const [state, formAction] = useFormState(addCabinet, null);
  const params = useParams();
  const router = useRouter();

  const { data: places } = useSWR("/api/place", placesFetcher);
  const { data: users } = useSWR("/api/user", usersFetcher);

  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const handleModal = () => setIsOpenedModal((prev) => !prev);
  const onClose = () => {
    setIsOpenedModal(false);
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
      <AddButton onClick={handleModal} />

      {isOpenedModal &&
        createPortal(
          <Modal onClose={setIsOpenedModal}>
            <form
              className="flex justify-center items-center flex-col w-[321px] gap-3"
              action={formAction}
            >
              <h5 className="md:self-start self-center text-base uppercase">
                Добавить кабинет
              </h5>

              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Название*"
                required
                fullWidth
              />

              {users && (
                <Select id="responsible" name="responsible" className="w-full">
                  <option value="0">Ответственный</option>
                  {users.map((user) => (
                    <option value={String(user.id)} key={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Select>
              )}

              {places && (
                <Select
                  id="place"
                  name="place"
                  defaultValue={String(params.placeId ?? "")}
                  className="w-full"
                  required
                >
                  {places.map((place) => (
                    <option value={String(place.id)} key={place.id}>
                      {place.name}
                    </option>
                  ))}
                </Select>
              )}

              <div className="flex self-end justify-between items-center w-full">
                <Button onClick={onClose} danger type="button">
                  Отменить
                </Button>

                <Button type="submit">Добавить</Button>
              </div>
            </form>
          </Modal>,
          document.body
        )}
    </>
  );
};
