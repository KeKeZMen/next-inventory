export type RightActionType = {
  rightId?: number;
  name: string;
  placeActions: boolean;
  cabinetActions: boolean;
  productActions: boolean;
  userActions: boolean;
  rightActions: boolean;
  typeActions: boolean;
  consumablesActions: boolean;
  orderSuccesing: boolean;
};

export interface IRight {
  id: number;
  name: string;
  placeActions: boolean;
  cabinetActions: boolean;
  productActions: boolean;
  userActions: boolean;
  consumablesActions: boolean;
  rightActions: boolean;
  typeActions: boolean;
  orderSuccesing: boolean;
}
