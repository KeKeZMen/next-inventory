import { User } from "next-auth";
import { FC } from "react";

type PropsType = {
  deleteButton?: JSX.Element;
  editButton?: JSX.Element;
  user: User;
};

export const UserRow: FC<PropsType> = ({ deleteButton, editButton, user }) => {
  return (
    <div className="flex justify-between items-center w-full border-b-2 border-[#a9a9a9] py-3">
      <h5>{user.name}</h5>
      <div className="flex justify-between gap-3 items-center">
        {editButton}
        {deleteButton}
      </div>
    </div>
  );
};
