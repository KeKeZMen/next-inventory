export interface IOrder {
  isDone: boolean;
  place: {
    name: string;
    id: number;
  };
  id?: number;
  placeId: number;
  createdAt: Date;
  orderItems: Array<{
    count: number;
    consumable: {
      name: string;
      count: number;
      id: number;
    };
  }>;
}
