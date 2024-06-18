"use client";

import { FC, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button, Input } from "@/shared";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@prisma/client";
import clsx from "clsx";

type PropsType = {
  users: User[];
};

const AuthForm: FC<PropsType> = ({ users }) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      setIsLoading(false);

      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        return toast.error("Неверный пароль");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Ошибка сервера");
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full">
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Имя пользователя"
              {...register("name")}
              className={clsx(
                `w-full rounded-md p-5 bg-gray sm:text-sm sm:leading-6 outline-none`
              )}
              list="users"
            />
          </div>

          <datalist id="users">
            {users.map((user) => (
              <option key={user.id} value={user.name}>
                {user.name}
              </option>
            ))}
          </datalist>

          <Input
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id="password"
            placeholder="Пароль"
            type="password"
          />

          <Button disabled={isLoading} fullWidth type="submit">
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
