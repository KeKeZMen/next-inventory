import { ProductRow } from "@/entities/product/ui/ProductRow";
import { AddProductButton } from "@/features/product/AddProductButton/ui";
import { DeleteProductButton } from "@/features/product/DeleteProductButton/ui";
import { EditProductButton } from "@/features/product/EditProductButton/ui";
import { db } from "@/shared";
import { ProductsTable } from "@/shared/ui/ProductsTable";
import { ProductsSelects } from "@/features/product/ProductsSelects";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/authOptions";
import { redirect } from "next/navigation";

type SearchParamsType = {
  key: "inventoryNumber" | "serialNumber";
  orderBy: "asc" | "decs";
};

export default async function TypePage({
  params,
  searchParams,
}: {
  params: { typeId: string };
  searchParams: SearchParamsType;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return redirect("/login");

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

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
      typeId: parseInt(params.typeId),
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
      cabinetId: true,
    },
    orderBy,
  });

  return (
    <ProductsTable
      title="Позиции"
      addButton={<AddProductButton />}
      isAdmin={right?.productActions}
      selects={<ProductsSelects sortSelect typeSelect />}
    >
      {products.map((product) => (
        <ProductRow
          product={product}
          deleteButton={<DeleteProductButton productId={product.id} />}
          editButton={<EditProductButton product={product} />}
          key={product.id}
          isAdmin={right?.productActions}
        />
      ))}
    </ProductsTable>
  );
}
