import { FC } from "react";
import clsx from "clsx";
import type { Product } from "@prisma/client"

type PropsType = {
  product: Product;
  editButton?: JSX.Element;
  deleteButton?: JSX.Element;
  isAdmin?: boolean;
};

export const ProductRow: FC<PropsType> = ({
  product,
  deleteButton,
  editButton,
  isAdmin,
}) => {
  return (
    <tr className="h-full">
      <td
        className={clsx(
          product.onUtil && "bg-on-delete",
          "border-t-2 border-[#929292] text-center p-3"
        )}
      >
        {product.name}
      </td>
      <td
        className={clsx(
          product.onUtil && "bg-on-delete",
          "border-t-2 border-[#929292] text-center p-3"
        )}
      >
        {product.description}
      </td>
      <td
        className={clsx(
          product.onUtil && "bg-on-delete",
          "border-t-2 border-[#929292] text-center p-3"
        )}
      >
        {product.inventoryNumber}
      </td>
      <td
        className={clsx(
          product.onUtil && "bg-on-delete",
          "border-t-2 border-[#929292] text-center p-3"
        )}
      >
        {product.count}
      </td>
      {!isAdmin && (
        <td
          className={clsx(
            product.onUtil && "bg-on-delete",
            "border-t-2 border-[#929292] text-center p-3"
          )}
        >
          {editButton}
          {deleteButton}
        </td>
      )}
    </tr>
  );
};
