import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UsersTable } from "@/widgets/UsersTable";
import { db } from "@/shared";
import RightsTable from "@/widgets/RightsTable";
import { TypesTable } from "@/widgets/TypesTable";
import { PlacesTable } from "@/widgets/PlacesTable";
import { ModelsTable } from "@/widgets/ModelsTable";

const AdminPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) return redirect("/login");

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-5 gap-3 md:h-full">
      {right?.userActions && <UsersTable />}
      {right?.rightActions && <RightsTable />}
      {right?.typeActions && <TypesTable />}
      {right?.placeActions && <PlacesTable />}
      {right?.consumablesActions && <ModelsTable />}
    </div>
  );
};

export default AdminPage;
