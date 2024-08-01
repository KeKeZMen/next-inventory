import type { Consumable, Product, Order, Place } from "@prisma/client";

export interface IConsumableWithModels extends Consumable {
  models: Array<{ name: string; id: number }>;
}

export interface ISearchedProduct {
  name: string;
  inventoryNumber: string;
  cabinet: {
    id: number;
    name: string;
    place: {
      id: number;
      name: string;
    };
  };
}

export interface IProductWithCabinet extends Product {
  cabinet: {
    id: number;
    placeId: number;
  };
}

export type OrderingConsumableType = {
  id: number;
  name: string;
  count: number;
};

export interface IOrderWithOrderItemsAndPlace extends Order {
  orderItems: {
    count: number;
    consumable: {
      name: string;
      count: number;
      id: number;
    };
  }[];
  place: Place;
}
