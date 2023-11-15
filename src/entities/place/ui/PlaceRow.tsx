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
    <tr>
      <td>
        <h5>{place.name}</h5>
      </td>
      <td>
        {editButton}
        {deleteButton}
        {cabinetsCount}
      </td>
    </tr>
  );
};
