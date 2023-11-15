import { IRight } from "../lib/types";
import { FC } from "react";

type PropsType = {
  deleteButton: JSX.Element;
  editButton: JSX.Element;
  right: IRight;
};

export const RightRow: FC<PropsType> = ({
  deleteButton,
  editButton,
  right,
}) => {
  return (
    <tr>
      <td>
        <h5>{right.name}</h5>
      </td>
      <td>
        {editButton}
        {deleteButton}
      </td>
    </tr>
  );
};
