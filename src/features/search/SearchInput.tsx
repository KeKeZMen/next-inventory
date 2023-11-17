"use client";

import { ISearchedProduct } from "@/entities/product/lib/types";
import { SearchedProducts } from "@/entities/product/ui/SearchedProducts";
import { DeleteButton } from "@/shared";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";
import { ChangeEvent, useEffect, useState } from "react";

const getSearchedProducts = async (searchTerm?: string) => {
  if (searchTerm) {
    try {
      const res = await fetch(`/api/product/search/${searchTerm}`);
      return res.json() as Promise<Array<ISearchedProduct>>;
    } catch (e) {
      return [] as Array<ISearchedProduct>;
    }
  } else {
    return [] as Array<ISearchedProduct>;
  }
};

export const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [searchedProducts, setSearchedProducts] = useState<
    Array<ISearchedProduct>
  >([]);
  const [isOpenedDialog, setIsOpenedDialog] = useState(false);

  useEffect(() => {
    if (debouncedSearchTerm !== "") {
      setIsOpenedDialog(true);
      getSearchedProducts(searchTerm).then((data) => setSearchedProducts(data));
    } else {
      setIsOpenedDialog(false);
    }
  }, [debouncedSearchTerm]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClean = () => {
    setSearchTerm("");
    setIsOpenedDialog(false);
  };

  return (
    <div className="flex justify-center items-center relative w-full ml-5">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Поиск"
        className="outline-none bg-[#f4f4f4] rounded-md text-xl text-black p-[2px] w-full"
      />
      {searchTerm && (
        <DeleteButton
          className="absolute right-[10px] w-5 h-5 bg-no-repeat"
          onClick={handleClean}
        />
      )}

      {isOpenedDialog && searchedProducts && (
        <div className="absolute bg-white rounded-md px-5 top-10 w-full z-50 shadow-md max-h-[200px] overflow-y-auto">
          {searchedProducts.length < 1 ? (
            <p className="my-5 text-black">Нет совпадений</p>
          ) : (
            searchedProducts.map((product, index) => (
              <SearchedProducts
                searchedProduct={product}
                key={index}
                onClick={handleClean}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
