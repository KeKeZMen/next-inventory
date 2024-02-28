export interface IConsumable {
  id: number;
  name: string;
  models?: Array<{ id: number; name: string }>;
  required: boolean;
  count: number;
}

export type ConsumableActionType = {
  id?: number;
  name: string;
  models: Array<string>;
  required: boolean;
  count: number;
};
