import { ProductRow } from "@/entities/product/ui/ProductRow";
import { AddProductButton } from "@/features/product/AddProductButton";
import { DeleteProductButton } from "@/features/product/DeleteProductButton";
import { EditProductButton } from "@/features/product/EditProductButton";
import { db } from "@/shared";
import { ProductsTable } from "@/shared/ui/ProductsTable";
import { ProductsSelects } from "@/widgets/ProductsSelects";
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
    },
    orderBy,
  });

  return (
    <ProductsTable
      title="Позиции"
      addButton={<AddProductButton />}
      selects={<ProductsSelects sortSelect />}
      height="500px"
    >
      {products.map((product) => (
        <ProductRow
          product={product}
          deleteButton={<DeleteProductButton productId={product.id} />}
          editButton={<EditProductButton product={product} />}
          key={product.id}
        />
      ))}
    </ProductsTable>
  );
};

export default CabinetPage;
