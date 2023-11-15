import { FC } from "react";
import clsx from "clsx";
import { IProduct } from "../lib/types";

type PropsType = {
  product: IProduct;
  editButton?: JSX.Element;
  deleteButton?: JSX.Element;
  withoutEdit?: boolean;
};

export const ProductRow: FC<PropsType> = ({
  product,
  deleteButton,
  editButton,
  withoutEdit,
}) => {
  return (
    <tr>
      <td
        className={clsx(
          product.onUtil && "bg-on-delete",
          "border-t-2 border-[#929292] text-center p-3"
        )}
      >
        {product.id}
      </td>
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
        {product.inventoryNumber2}
      </td>
      <td
        className={clsx(
          product.onUtil && "bg-on-delete",
          "border-t-2 border-[#929292] text-center p-3"
        )}
      >
        {product.inventoryNumber3}
      </td>
      <td
        className={clsx(
          product.onUtil && "bg-on-delete",
          "border-t-2 border-[#929292] text-center p-3"
        )}
      >
        {product.serialNumber}
      </td>
      <td
        className={clsx(
          product.onUtil && "bg-on-delete",
          "border-t-2 border-[#929292] text-center p-3"
        )}
      >
        {product.count}
      </td>
      {!withoutEdit && (
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
