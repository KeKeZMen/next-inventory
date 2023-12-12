export type CabinetActionType = {
  cabinetId?: number;
  name: string;
  placeId: number;
  responsibleId: number;
};

export interface ICabinet {
  id: number;
  name: string;
  placeId: number;
  responsibleId: number | null;
}
