import { NextResponse } from "next/server";
import { dirname, join } from "path";
import { writeFile, unlink } from "fs/promises";
import ExcelJs from "exceljs";
import { db } from "@/shared";
import { fileURLToPath } from "url";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json(
      { message: "Вы не авторизованы!" },
      { status: 401 }
    );

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (right?.id !== 1)
    return NextResponse.json({ message: "Нет доступа" }, { status: 401 });

  const body = await req.formData();
  const file: File | null = body.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ message: "Вы не загрузили файл!" });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const path = join(__dirname, file.name);
  await writeFile(path, buffer);

  let workBook = new ExcelJs.Workbook();
  const excelFile = await workBook.xlsx.readFile(path);

  const workSheet = excelFile.getWorksheet(1);
  if (!workSheet)
    return NextResponse.json({ message: "Неверный формат таблицы!" });

  const rows = [];

  let headers = workSheet.getRow(1).values as Array<string>;
  headers = headers.filter((el) => el);

  for (let i = 2; i <= workSheet.rowCount; i++) {
    const row = new Map();

    let values = workSheet.getRow(i).values as Array<string>;
    values = values.filter((el) => el);

    for (let j = 0; j < workSheet.columnCount; j++) {
      row.set(headers[j], String(values[j]));
    }

    rows.push(row);
  }

  await db.$transaction([
    db.place.createMany({
      data: [
        ...Array.from(
          new Set(
            rows.map((row) =>
              (row.get("Площадка") as string).trim().toLowerCase()
            )
          )
        ).map((place) => ({
          name: place[0].toUpperCase() + place.slice(1).toLowerCase(),
        })),
      ],
    }),
    db.type.createMany({
      data: [
        ...Array.from(
          new Set(
            rows.map((row) => (row.get("Тип") as string).trim().toLowerCase())
          )
        ).map((type) => ({
          name: type[0].toUpperCase() + type.slice(1).toLowerCase(),
        })),
      ],
    }),
  ]);

  const places = await db.place.findMany();
  await db.userPlace.createMany({
    data: [...places.map((place) => ({ placeId: place.id, userId: 1 }))],
  });

  const productsData = rows
    .map((row) => ({
      place:
        String(row.get("Площадка"))[0].toUpperCase() +
        String(row.get("Площадка")).slice(1).toLowerCase(),
      cabinet: String(row.get("Кабинет")).trim().toLowerCase(),
      product: {
        name: String(row.get("Название")).trim(),
        type:
          String(row.get("Тип"))[0].trim().toUpperCase() +
          String(row.get("Тип")).slice(1).trim().toLowerCase(),
        desk: String(row.get("Описание")).trim(),
        inv: String(row.get("Инвентарный №")).trim(),
        count: row.get("Количество"),
      },
    }))
    .filter((d) => {
      if (d.cabinet == "undefined") return false;
      if (d.place == "undefined") return false;
      for (const key in d.product) {
        if (key == "undefined") {
          return false;
        }
      }
      return true;
    });

  for (let i = 0; i < productsData.length; i++) {
    const place = await db.place.findFirst({
      where: {
        name: productsData[i].place.toUpperCase(),
      },
    });

    if (!place)
      return NextResponse.json({ message: "Не все площадки созданы!" });

    const type = await db.type.findFirst({
      where: {
        name: productsData[i].product.type,
      },
    });

    if (!type) return NextResponse.json({ message: "Не все типы созданы!" });

    let cabinet = await db.cabinet.findFirst({
      where: {
        AND: [
          { name: productsData[i].cabinet },
          { place: { name: productsData[i].place.toUpperCase() } },
        ],
      },
    });

    if (!cabinet) {
      cabinet = await db.cabinet.create({
        data: {
          name: productsData[i].cabinet,
          placeId: place.id,
        },
      });
    }

    await db.product.create({
      data: {
        count: 1,
        description: productsData[i].product.desk,
        inventoryNumber: productsData[i].product.inv,
        name: productsData[i].product.name,
        cabinetId: cabinet.id,
        userAdded: 1,
        typeId: type.id,
      },
    });
  }

  await unlink(path);

  return NextResponse.json({ message: "Импорт выполнен успешно!" });
}
