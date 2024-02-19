export type ProductActionType = {
  productId?: number;
  name: string;
  description: string;
  inventoryNumber: string;
  onUtil: boolean;
  cabinetId: number;
  typeId: number;
  count: number;
};

export interface IProduct {
  id: number;
  name: string;
  description: string;
  inventoryNumber: string;
  onUtil: boolean;
  cabinet: {
    id: number;
    placeId: number;
  };
  typeId: number;
  count: number;
}

export interface ISearchedProduct {
  name: string
  inventoryNumber: string
  cabinet: {
    id: number
    name: string
    place: {
      id: number
      name: string      
    }
  }
}
