"use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { IRight, RightActionType } from "../lib/types";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button, Input } from "@/shared";
import { Checkbox } from "@/shared/ui/Checkbox";

type PropsType = {
  formTitle: string;
  submitTitle: string;
  onSubmitAction: (args: RightActionType) => any;
  onClose?: () => void;
  right?: IRight;
};

export const RightForm: FC<PropsType> = ({
  formTitle,
  submitTitle,
  onSubmitAction,
  onClose,
  right,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: right ? right.name : "",
      placeActions: right ? right.placeActions : false,
      cabinetActions: right ? right.cabinetActions : false,
      productActions: right ? right.productActions : false,
      userActions: right ? right.userActions : false,
      rightActions: right ? right.rightActions : false,
      typeActions: right ? right.typeActions : false,
      consumableActions: right ? right.consumablesActions : false
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      await onSubmitAction({
        name: data.name,
        placeActions: data.placeActions,
        cabinetActions: data.cabinetActions,
        productActions: data.productActions,
        userActions: data.userActions,
        rightActions: data.rightActions,
        typeActions: data.typeActions,
        rightId: right?.id,
        consumablesActions: data.consumablesActions,
        orderSuccesing: data.orderSuccesing,
      });

      setIsLoading(false);

      router.refresh();
      onClose?.();
    } catch (error) {
      setIsLoading(false);
      toast.error("Ошибка сервера");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-center items-center flex-col w-[321px]"
    >
      <h5 className="md:self-start self-center text-base uppercase mb-[10px]">
        {formTitle}
      </h5>

      <Input
        type="text"
        disabled={isLoading}
        errors={errors}
        id="name"
        placeholder="Название*"
        required
        fullWidth
        register={register}
      />

      <Checkbox
        defaultChecked={right?.placeActions}
        register={register}
        id="placeActions"
        label="Площадки"
        margin="10px 0"
      />

      <Checkbox
        defaultChecked={right?.productActions}
        register={register}
        id="productActions"
        label="Продукты"
        margin="10px 0"
      />

      <Checkbox
        defaultChecked={right?.rightActions}
        register={register}
        id="rightActions"
        label="Права"
        margin="10px 0"
      />

      <Checkbox
        defaultChecked={right?.typeActions}
        register={register}
        id="typeActions"
        label="Типы"
        margin="10px 0"
      />

      <Checkbox
        defaultChecked={right?.userActions}
        register={register}
        id="userActions"
        label="Пользователи"
        margin="10px 0"
      />

      <Checkbox
        defaultChecked={right?.cabinetActions}
        register={register}
        id="cabinetActions"
        label="Кабинеты"
        margin="10px 0"
      />

      <Checkbox
        defaultChecked={right?.consumablesActions}
        register={register}
        id="consumablesActions"
        label="Расходники"
        margin="10px 0"
      />

      <Checkbox
        defaultChecked={right?.orderSuccesing}
        register={register}
        id="orderSuccesing"
        label="Подтверждение заказов"
        margin="10px 0"
      />

      <div className="flex self-end justify-between items-center w-full">
        <Button onClick={onClose} danger disabled={isLoading}>
          Отменить
        </Button>

        <Button type="submit" disabled={isLoading}>
          {submitTitle}
        </Button>
      </div>
    </form>
  );
};
