export interface IOrder {
  id: number;
  placeId: number;
  place?: { name: string; id: number };
  isDone: boolean;
  createdAt: Date
}

export type OrderActionType = {
  id?: number;
  placeId: number;
  isDone: boolean;
};
