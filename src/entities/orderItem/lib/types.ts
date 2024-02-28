export interface IOrderItem {
  id: number;
  count: number;
  consumableId: number
  consumable?: { name: string }
}
