export interface IOrderItem {
  id: number;
  count: number;
  consumable: {
    count: number;
    name: string;
  };
}
