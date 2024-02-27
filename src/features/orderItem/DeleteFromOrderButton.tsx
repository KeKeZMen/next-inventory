"use client";

import { FC } from "react";
import { DeleteButton } from "@/shared";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type PropsType = {
  orderItemId: number;
};

export const DeleteFromOrderButton: FC<PropsType> = ({ orderItemId }) => {
  const router = useRouter();

  const onDelete = async (orderItemId: number) => {
    try {
      const res = await fetch(`/api/orderitem`, {
        body: JSON.stringify({ orderItemId }),
        method: "DELETE",
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

  const handleDeleteFromOrder = () => {
    onDelete(orderItemId);
    router.refresh();
  };

  return <DeleteButton onClick={handleDeleteFromOrder} />;
};
