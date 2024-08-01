import { TypeRow } from "@/entities/type/ui/TypeRow";
import { DataTable, db } from "@/shared";
import { authOptions } from "@/shared/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const TypesCounts = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) return redirect("/login");  

  const types = await db.type.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          products: {
            where: {
              cabinet: {
                placeId: {
                  in: session.user.places.map((place) => Number(place)),
                },
              },
            },
          },
        },
      },
    },
    where: {
      products: {
        some: {
          cabinet: {
            placeId: {
              in: session.user.places.map((place) => Number(place)),
            },
          },
        },
      },
    },
  });

  return (
    <DataTable title="Типы оборудования">
      {types.map(({ name, id, _count }) => (
        <TypeRow type={{ name, id }} productsCount={_count.products} key={id} />
      ))}
    </DataTable>
  );
};
