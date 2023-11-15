import React, { FC } from "react";
import { ISearchedProduct } from "../lib/types";
import Link from "next/link";

type PropsType = {
  searchedProduct: ISearchedProduct;
};

export const SearchedProducts: FC<PropsType> = ({ searchedProduct }) => {
  return (
    <div className="flex justify-between p-[15px] text-black border-b-2 border-black last:border-0">
      <p>{searchedProduct.name}</p>
      <Link
        href={`/place/${searchedProduct.cabinet.place.id}/cabinet/${searchedProduct.cabinet.id}`}
      >
        {searchedProduct.cabinet.place.name}: {searchedProduct.cabinet.name}
      </Link>
    </div>
  );
};
