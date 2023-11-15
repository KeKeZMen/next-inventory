export type RightActionType = {
  rightId?: number;
  name: string;
  placeActions: boolean;
  cabinetActions: boolean;
  productActions: boolean;
  userActions: boolean;
  rightActions: boolean;
  typeActions: boolean;
};

export interface IRight {
  id: number;
  name: string;
  placeActions: boolean;
  cabinetActions: boolean;
  productActions: boolean;
  userActions: boolean;
  rightActions: boolean;
  typeActions: boolean;
}
