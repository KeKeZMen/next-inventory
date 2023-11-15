import { UserRow } from "@/entities/user/ui/UserRow";
import { AddUserButton } from "@/features/user/AddUserButton";
import { DeleteUserButton } from "@/features/user/DeleteUserButton";
import { EditUserButton } from "@/features/user/EditUserButton";
import { DataTable, db } from "@/shared";

export const UsersTable = async () => {
  const users = await db.user.findMany({
    where: {
      NOT: {
        id: 1,
      },
    },
  });

  return (
    <DataTable title="Пользователи" addAction={<AddUserButton />}>
      {users.map((user) => (
        <UserRow
          user={user}
          key={user.id}
          deleteButton={<DeleteUserButton userId={user.id} />}
          editButton={<EditUserButton user={user} />}
        />
      ))}
    </DataTable>
  );
};
