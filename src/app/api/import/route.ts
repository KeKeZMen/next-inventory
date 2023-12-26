import { NextResponse } from "next/server";
import { dirname, join } from "path";
import { writeFile, unlink } from "fs/promises";
import ExcelJs from "exceljs";
import { db } from "@/shared";
import { fileURLToPath } from "url";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

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
        ).map((place) => ({ name: place })),
      ],
    }),
    db.type.createMany({
      data: [
        ...Array.from(
          new Set(
            rows.map((row) => (row.get("Тип") as string).trim().toLowerCase())
          )
        ).map((type) => ({ name: type })),
      ],
    }),
  ]);

  const productsData = rows
    .map((row) => ({
      place: String(row.get("Площадка")).trim().toLowerCase(),
      cabinet: String(row.get("Кабинет")).trim().toLowerCase(),
      product: {
        name: String(row.get("Название")).trim(),
        type: String(row.get("Тип")).trim().toLowerCase(),
        desk: String(row.get("Описание")).trim(),
        inv1: String(row.get("Инвентарный № 1")).trim(),
        inv2: String(row.get("Инвентарный № 2")).trim(),
        inv3: String(row.get("Инвентарный № 3")).trim(),
        ser: String(row.get("Серийный №")).trim(),
        count: row.get("Количество"),
      },
    }))
    .filter((d) => d.place !== "undefined");

  for (let i = 0; i < productsData.length; i++) {
    const place = await db.place.findFirst({
      where: {
        name: productsData[i].place,
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
          { place: { name: productsData[i].place } },
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
        count: Number(productsData[i].product.count),
        description: productsData[i].product.desk,
        inventoryNumber: productsData[i].product.inv1,
        inventoryNumber2: productsData[i].product.inv2,
        inventoryNumber3: productsData[i].product.inv3,
        name: productsData[i].product.name,
        cabinetId: cabinet.id,
        userAdded: 1,
        serialNumber: productsData[i].product.ser,
        typeId: type.id,
      },
    });
  }

  await unlink(path);

  return NextResponse.json({ message: "Импорт выполнен успешно!" });
}
