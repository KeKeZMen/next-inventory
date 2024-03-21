import { FC, InputHTMLAttributes, useId } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface PropsType extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  margin?: string;
  id?: string;
  register?: UseFormRegister<FieldValues>;
}

export const Checkbox: FC<PropsType> = ({
  label,
  margin,
  register,
  id,
  ...checkboxProps
}) => {
  const labelId = useId();
  return (
    <div
      className="flex items-center w-full"
      style={{
        margin,
      }}
    >
      <input
        type="checkbox"
        className="absolute z-[-1] opacity-0 checkbox__input"
        
        {...register && id ? {...register(id)} : null}
        id={labelId}
        {...checkboxProps}
      />
      {label && (
        <label className="cursor-pointer text-xl" htmlFor={labelId}>
          {label}
        </label>
      )}
    </div>
  );
};
