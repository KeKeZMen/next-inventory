"use client";

import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { IOrderItem } from "@/entities/orderItem/lib/types";

type PropsType = {
  orderItem: IOrderItem;
  maxCount: number;
};

export const CountEdit: FC<PropsType> = ({ orderItem, maxCount }) => {
  const router = useRouter();
  const [count, setCount] = useState(orderItem.count);

  const sendNewCount = async (newCount: number, orderItemId: number) => {
    try {
      if (newCount == 0) {
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
      }

      const res = await fetch(`/api/orderitem`, {
        body: JSON.stringify({ orderItemId, newCount }),
        method: "PATCH",
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

  const handleCount = (e: React.MouseEvent) => {
    if (e.currentTarget.id == "minus")
      return setCount((prev) => prev - 1);
    if (e.currentTarget.id == "plus" && count < maxCount)
      return setCount((prev) => prev + 1);

    toast.error(`Нельзя выбрать больше ${maxCount}`);
  };

  const handleAddToOrder = () => {
    sendNewCount(count, orderItem.id);
    router.refresh();
  };

  return (
    <div className="grid grid-cols-[1fr,2fr,1fr] border-2 rounded-md">
      <button id="minus" onClick={handleCount}>
        -
      </button>
      <button onClick={handleAddToOrder} className="border-l-2 border-r-2">
        {count}
      </button>
      <button id="plus" onClick={handleCount}>
        +
      </button>
    </div>
  );
};
