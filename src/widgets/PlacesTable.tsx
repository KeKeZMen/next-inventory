import { PlaceRow } from "@/entities/place/ui/PlaceRow";
import { AddPlaceButton } from "@/features/place/AddPlaceButton";
import { DeletePlaceButton } from "@/features/place/DeletePlaceButton";
import { EditPlaceButton } from "@/features/place/EditPlaceButton";
import { DataTable, db } from "@/shared";
import React from "react";

export const PlacesTable = async () => {
  const places = await db.place.findMany();

  return (
    <DataTable title="Площадки" addAction={<AddPlaceButton />} height="400px">
      {places.map((place) => (
        <PlaceRow
          place={place}
          deleteButton={<DeletePlaceButton placeId={place.id} />}
          editButton={<EditPlaceButton place={place} />}
          key={place.id}
        />
      ))}
    </DataTable>
  );
};
