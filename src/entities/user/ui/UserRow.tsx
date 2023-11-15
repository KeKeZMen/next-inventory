import { User } from "next-auth";
import { FC } from "react";

type PropsType = {
  deleteButton?: JSX.Element;
  editButton?: JSX.Element;
  user: User;
};

export const UserRow: FC<PropsType> = ({ deleteButton, editButton, user }) => {
  return (
    <tr>
      <td>
        <h5>{user.name}</h5>
      </td>
      <td>
        {editButton}
        {deleteButton}
      </td>
    </tr>
  );
};
