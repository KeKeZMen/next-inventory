import { NextResponse } from "next/server";
import { join } from "path";
import { writeFile, unlink } from "fs/promises";
import ExcelJs from "exceljs";
import { db } from "@/shared";

type ProductData = Array<string>;

type CabinetData = {
  name: string;
  products: Array<ProductData>;
};

type PlaceData = {
  name: string;
  cabinets: Array<CabinetData>;
};

export async function POST(req: Request) {
  const body = await req.formData();
  const file: File | null = body.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ message: "Вы не загрузили файл!" });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const path = join("/", "tmp", file.name);
  await writeFile(path, buffer);

  let workBook = new ExcelJs.Workbook();
  const excelFile = await workBook.xlsx.readFile(path);

  const workSheet = excelFile.getWorksheet(1);
  if (!workSheet)
    return NextResponse.json({ message: "Неверный формат таблицы!" });

  workSheet.getRow(1).eachCell((cell, colNumber) => {
    workSheet.getColumn(colNumber).key = cell.text;
  });

  const rows = []

  let headers = workSheet.getRow(1).values as Array<string>
  headers = headers.filter(el => el)
  
  for (let i = 2; i < workSheet.rowCount; i++) {
    const row = new Map()

    let values = workSheet.getRow(i).values as Array<string>
    values = values.filter(el => el)
    
    for (let j = 0; j < workSheet.columnCount; j++) {  
      row.set(headers[j], String(values[j]))
    }
    
    rows.push(row)
  }

  await db.$transaction([
    db.place.createMany({
      data: [
        ...Array.from(new Set(rows.map((row) => row.get("Площадка")))).map((place) => ({ name: place })),
      ],
    }),
    db.type.createMany({
      data: [
        ...Array.from(new Set(rows.map((row) => row.get("Тип")))).map((type) => ({ name: type })),
      ],
    }),
  ]);

  const productsData = rows.map(row => ({
    place: row.get("Площадка"),
    cabinet: row.get("Кабинет"),
    product: {
      name: row.get("Название"),
      type: row.get("Тип"),
      desk: row.get("Описание"),
      inv1: row.get("Инвентарный № 1"),
      inv2: row.get("Инвентарный № 2"),
      inv3: row.get("Инвентарный № 3"),
      ser: row.get("Серийный №"),
      count: row.get("Количество")
    }
  }))

  for (let i = 0; i < productsData.length; i++) {
    const place = await db.place.findFirst({
      where: {
        name: productsData[i].place
      }
    })

    if(!place) return NextResponse.json({ message: "Не все площадки созданы!" })

    const type = await db.type.findFirst({
      where: {
        name: productsData[i].product.type
      }
    })

    if(!type) return NextResponse.json({ message: "Не все типы созданы!" })

    let cabinet = await db.cabinet.findFirst({
      where: {
        AND: [
          { name: productsData[i].cabinet },
          { place: { name: productsData[i].place } }
        ]
      }
    })

    if(!cabinet) {
      cabinet = await db.cabinet.create({
        data: {
          name: productsData[i].cabinet,
          placeId: place?.id
        }
      }) 
    }

    const product = await db.product.create({
      data: {
        count: Number(productsData[i].product.count),
        description: productsData[i].product.desk,
        inventoryNumber: productsData[i].product.inv1,
        inventoryNumber2: productsData[i].product.inv2,
        inventoryNumber3: productsData[i].product.inv3,
        name: productsData[i].product.ser,
        cabinetId: cabinet.id,
        userAdded: 1,
        serialNumber: productsData[i].product.ser,
        typeId: type.id
      },
    });
  }

  // for (let i = 2; i <= workSheet.rowCount; i++) {
  //   const values = workSheet.getRow(i).values as Array<string>

  //   const place = await db.place.findFirst({
  //     where: {
  //       name: values[1]
  //     }
  //   })

  //   const cabinet = await db.cabinet.findFirst({
  //     where: {
  //       AND: [
  //         { placeId: place?.id },
  //         { name: String(values[2]) }
  //       ]
  //     }
  //   })

  //   const type = await db.type.findFirst({
  //     where: {
  //       name: values[3]
  //     }
  //   })

  //   if(!type || !cabinet) return NextResponse.json({ message: "Указанного типа или кабинета не существует!" })

  //   const product = await db.product.create({
  //     data: {
  //       name: String(values[4]),
  //       description: String(values[5]),
  //       inventoryNumber: String(values[6]),
  //       inventoryNumber2: String(values[7]),
  //       inventoryNumber3: String(values[8]),
  //       serialNumber: String(values[9]),
  //       count: Number(values[10]),
  //       typeId: type.id,
  //       cabinetId: cabinet.id,
  //       userAdded: 1,
  //     }
  //   })
  // }

  await unlink(path);

  return NextResponse.json({ message: "Импорт выполнен успешно!" });
}
