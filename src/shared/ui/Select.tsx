"use client";

import { useCallback, useEffect, useRef, useState, FC } from "react";

export type OptionType = {
  value: string;
  label: string;
};

type PropsType = {
  selected: string;
  options: OptionType[];
  onChange?: (selected: OptionType["value"]) => void;
  placeholder?: string;
  fullwidth?: boolean;
  margin?: string;
  padding?: string;
  minWidth?: string;
  chekboxed?: boolean;
};

export const Select: FC<PropsType> = ({
  options,
  selected,
  onChange,
  placeholder,
  fullwidth,
  margin,
  padding = "20px",
  minWidth,
  chekboxed,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = () => setIsOpen((prev) => !prev);

  const selectRef = useRef<HTMLDivElement>(null);
  const handleCloseSelect = useCallback((e: MouseEvent) => {
    if (e.target instanceof Node && !selectRef.current?.contains(e.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.body.addEventListener("click", handleCloseSelect);

    return () => {
      document.body.removeEventListener("click", handleCloseSelect);
    };
  }, [isOpen]);

  const handleSelectValue = (value: string) => {
    setIsOpen(false);
    onChange?.(value);
  };

  return (
    <div
      className="outline-none rounded-md cursor-pointer relative border-[1px] border-[#464646]"
      ref={selectRef}
      style={{
        width: fullwidth ? "100%" : "",
        margin,
        minWidth,
      }}
    >
      <div className="grid grid-cols-[3fr,_1fr] " onClick={handleSelect}>
        <p className="select-none border-r-[1px]" style={{ padding }}>
          {chekboxed
            ? selected
            : options.find((opt) => opt.value == selected)?.label ||
              placeholder}
        </p>
        <img
          src="/arrow.svg"
          alt=""
          className="self-center justify-self-center transition-all"
          style={{
            transform: isOpen ? "rotate(-180deg)" : "",
          }}
        />
      </div>
      {isOpen && (
        <ul className="mt-[1px] absolute w-full list-none bg-white max-h-[150px] overflow-y-auto shadow-md z-[1000] rounded-md">
          {options.map((option) =>
            !chekboxed ? (
              <li
                onClick={() => handleSelectValue(option.value)}
                className="p-5 cursor-pointer last:border-none"
                key={option.value}
              >
                {option.label}
              </li>
            ) : (
              <li key={option.value} className="flex p-5 last:border-none">
                <input
                  id={option.value}
                  type="checkbox"
                  onChange={() => handleSelectValue(option.value)}
                  className="mr-3"
                />
                <label htmlFor={option.value}>{option.label}</label>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};
