"use client";

import { FC } from "react";
import { AddButton } from "@/shared";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type PropsType = {
  consumableId: number;
  orderId: number;
  onSuccess?: () => void
};

export const AddToOrderButton: FC<PropsType> = ({ consumableId, orderId, onSuccess }) => {
  const router = useRouter();

  const onAdd = async (consumableId: number, orderId: number) => {
    try {
      const res = await fetch(`/api/orderitem`, {
        body: JSON.stringify({ consumableId, orderId }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) return toast.error((await res.json()).message);

      toast.success((await res.json()).message);
      return router.refresh();
    } catch (error) {
      return toast.error("Ошибка сервера");
    }
  };

  const handleAddToOrder = () => {
    onAdd(consumableId, orderId);
    onSuccess?.();
    router.refresh();
  };

  return <AddButton onClick={handleAddToOrder} type="button"/>;
};
