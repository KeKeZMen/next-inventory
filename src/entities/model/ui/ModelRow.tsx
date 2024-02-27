import { FC } from "react";
import { IModel } from "../lib/types";

type PropsType = {
  model: IModel;
  deleteButton?: JSX.Element;
  editButton?: JSX.Element;
};

export const ModelRow: FC<PropsType> = ({
  deleteButton,
  editButton,
  model,
}) => {
  return (
    <tr>
      <td>
        <h5>{model.name}</h5>
      </td>
      <td>
        {editButton}
        {deleteButton}
      </td>
    </tr>
  );
};
