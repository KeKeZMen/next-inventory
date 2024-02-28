import { IPlace } from "../lib/types";
import { FC } from "react";

type PropsType = {
  deleteButton?: JSX.Element;
  editButton?: JSX.Element;
  place: IPlace;
  cabinetsCount?: number;
};

export const PlaceRow: FC<PropsType> = ({
  deleteButton,
  editButton,
  place,
  cabinetsCount,
}) => {
  return (
    <div className="flex justify-between items-center w-full border-b-2 border-[#a9a9a9] py-3">
      <h5>{place.name}</h5>
      <div className="flex justify-between gap-3 items-center">
        {editButton}
        {deleteButton}
        {cabinetsCount}
      </div>
    </div>
  );
};
