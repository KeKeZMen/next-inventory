import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/shared";
import { ProductRow } from "@/entities/product/ui/ProductRow";
import { ProductsTable } from "@/shared/ui/ProductsTable";
import { Header } from "@/widgets/Header";
import { authOptions } from "@/shared/lib/authOptions";

type SearchParamsType = {
  key: "inventoryNumber" | "serialNumber";
  orderBy: "asc" | "decs";
};

export default async function CabinetPage({
  params,
  searchParams,
}: {
  params: { cabinetId: string };
  searchParams: SearchParamsType;
}) {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/login");
  if (!session.user) return redirect("/login");
  if (session.isAdmin) return redirect("/");

  let orderBy = {};
  if (searchParams.key == "inventoryNumber") {
    orderBy = {
      inventoryNumber: searchParams.orderBy,
    };
  } else if (searchParams.key == "serialNumber") {
    orderBy = {
      serialNumber: searchParams.orderBy,
    };
  }

  const productsWithCabinets = await db.cabinet.findMany({
    where: {
      responsibleId: session.user.id,
    },
    select: {
      id: true,
      placeId: true,
      name: true,
      products: {
        select: {
          count: true,
          description: true,
          id: true,
          inventoryNumber: true,
          name: true,
          onUtil: true,
          typeId: true,
          userAdded: true,
          cabinet: {
            select: {
              placeId: true,
              id: true,
            },
          },
          cabinetId: true
        },
        orderBy,
      },
    },
  });

  return (
    <>
      <Header isNoAdmin user={session.user} />
      <main className="pt-[88px] md:p-6">
        {productsWithCabinets.map((cabinet) => (
          <ProductsTable
            title={`Позиции ${cabinet.name} кабинета`}
            margin="0 0 15px 0"
            key={cabinet.id}
          >
            {cabinet.products.map((product) => (
              <ProductRow product={product} key={product.id} />
            ))}
          </ProductsTable>
        ))}
      </main>
    </>
  );
}
