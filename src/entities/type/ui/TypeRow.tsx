import { IType } from "../lib/types";
import { FC } from "react";

type PropsType = {
  deleteButton?: JSX.Element;
  editButton?: JSX.Element;
  type: IType;
  productsCount?: number;
};

export const TypeRow: FC<PropsType> = ({
  deleteButton,
  editButton,
  type,
  productsCount,
}) => {
  return (
    <tr>
      <td>
        <h5>{type.name}</h5>
      </td>
      <td>
        {editButton}
        {deleteButton}
        {productsCount}
      </td>
    </tr>
  );
};
