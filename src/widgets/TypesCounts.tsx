import { TypeRow } from "@/entities/type/ui/TypeRow";
import { DataTable, db } from "@/shared";

export const TypesCounts = async () => {
  const types = await db.type.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return (
    <DataTable title="Типы оборудования">
      {types.map(({ name, id, _count }) => (
        <TypeRow type={{ name, id }} productsCount={_count.products} key={id} />
      ))}
    </DataTable>
  );
};
