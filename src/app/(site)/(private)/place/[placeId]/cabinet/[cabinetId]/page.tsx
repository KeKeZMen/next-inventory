import { ProductRow } from "@/entities/product/ui/ProductRow";
import { AddProductButton } from "@/features/product/AddProductButton/ui";
import { DeleteProductButton } from "@/features/product/DeleteProductButton/ui";
import { EditProductButton } from "@/features/product/EditProductButton/ui";
import { db } from "@/shared";
import { authOptions } from "@/shared/lib/authOptions";
import { ProductsTable } from "@/shared/ui/ProductsTable";
import { ProductsSelects } from "@/features/product/ProductsSelects";
import { getServerSession } from "next-auth";
import React from "react";

type SearchParamsType = {
  key: "inventoryNumber" | "serialNumber";
  orderBy: "asc" | "decs";
};

const CabinetPage = async ({
  params,
  searchParams,
}: {
  params: { cabinetId: string };
  searchParams: SearchParamsType;
}) => {
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

  const products = await db.product.findMany({
    where: {
      cabinetId: parseInt(params.cabinetId),
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
      name: true,
      onUtil: true,
      typeId: true,
      userAdded: true,
      cabinetId: true
    },
    orderBy,
  });

  const session = await getServerSession(authOptions);

  const right = await db.right.findFirst({
    where: {
      id: session?.user?.rightId,
    },
  });

  return (
    <ProductsTable
      title="Позиции"
      addButton={<AddProductButton />}
      selects={<ProductsSelects sortSelect />}
      isAdmin={right?.productActions}
    >
      {products.map((product) => (
        <ProductRow
          product={product}
          deleteButton={<DeleteProductButton productId={product.id} />}
          isAdmin={right?.productActions}
          editButton={<EditProductButton product={product} />}
          key={product.id}
        />
      ))}
    </ProductsTable>
  );
};

export default CabinetPage;
