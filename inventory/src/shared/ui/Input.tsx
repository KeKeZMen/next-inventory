"use client";

import clsx from "clsx";
import { InputHTMLAttributes, FC } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  register?: UseFormRegister<FieldValues>;
  errors?: FieldErrors;
  label?: string;
  fullWidth?: boolean;
}

export const Input: FC<InputProps> = ({
  id,
  register,
  errors,
  label,
  placeholder,
  disabled,
  fullWidth,
  defaultValue,
  name,
  type = "text",
}) => {
  return (
    <div className={clsx(fullWidth && "w-full")}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
      )}
      <div>
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          placeholder={placeholder}
          name={name}
          defaultValue={defaultValue}
          {...(register && id ? { ...register(id) } : null)}
          className={clsx(
            `block w-full rounded-md p-5 bg-gray sm:text-sm sm:leading-6 outline-none`,
            errors && errors[id] && "focus:ring-error",
            disabled && "opacity-50 cursor-default"
          )}
        />
      </div>
    </div>
  );
};
