import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/shared";
import { ProductRow } from "@/entities/product/ui/ProductRow";
import { ProductsTable } from "@/shared/ui/ProductsTable";
import { ProductsSelects } from "@/widgets/ProductsSelects";
import { Header } from "@/widgets/Header";

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
  if (session.isAdmin) return redirect("/")

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

  const cabinets = await db.cabinet.findMany({
    where: {
      responsibleId: session.user.id,
    },
  });

  const products = await db.product.findMany({
    where: {
      cabinetId: {
        in: cabinets.map((cabinet) => cabinet.id),
      },
    },
    select: {
      cabinet: {
        select: {
          id: true,
          placeId: true,
        },
      },
      count: true,
      description: true,
      id: true,
      inventoryNumber: true,
      inventoryNumber2: true,
      inventoryNumber3: true,
      name: true,
      onUtil: true,
      serialNumber: true,
      typeId: true,
      userAdded: true,
    },
    orderBy,
  });

  return (
    <>
      <Header isNoAdmin user={session.user} />
      <main className="pt-[88px] md:p-6">
        <ProductsTable
          title={`Позиции ${cabinets
            .map((cabinet) => cabinet.name)
            .join(", ")} ${cabinets.length > 1 ? "кабинетов" : "кабинета"}`}
          selects={<ProductsSelects sortSelect />}
          withoutEdit
        >
          {products.map((product) => (
            <ProductRow product={product} key={product.id} withoutEdit />
          ))}
        </ProductsTable>
      </main>
    </>
  );
}
