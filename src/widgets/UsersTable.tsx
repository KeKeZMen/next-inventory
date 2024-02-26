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
    select: {
      id: true,
      name: true,
      rightId: true,
      userPlace: {
        select: {
          placeId: true,
        },
      },
    },
  });

  return (
    <DataTable
      title="Пользователи"
      addAction={<AddUserButton />}
      height="300px"
    >
      {users
        .map((user) => ({
          name: user.name,
          rightId: user.rightId,
          id: user.id,
          places: user.userPlace.map((p) => String(p.placeId)),
        }))
        .map((user) => (
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
