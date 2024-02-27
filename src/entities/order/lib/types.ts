export interface IOrder {
  id: number;
  placeId: number;
  isDone: boolean;
}

export type OrderActionType = {
  id?: number;
  placeId: number;
  isDone: boolean;
};
