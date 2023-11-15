export interface IPlace {
  id: number;
  name: string;
}

export type PlaceActionType = {
  placeId?: number;
  name: string;
};
