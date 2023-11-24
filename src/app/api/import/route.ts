// import { NextResponse } from "next/server";
// import { join } from "path";
// import { writeFile, unlink } from "fs/promises";
// import ExcelJs from "exceljs";
// import { db } from "@/shared";

// export async function POST(req: Request) {
//   const body = await req.formData();
//   const file: File | null = body.get("file") as unknown as File;

//   if (!file) {
//     return NextResponse.json({ message: "Вы не загрузили файл!" });
//   }

//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);

//   const path = join("/", "tmp", file.name);
//   await writeFile(path, buffer);

//   let workBook = new ExcelJs.Workbook();
//   const excelFile = await workBook.xlsx.readFile(path);

//   const workSheet = excelFile.getWorksheet(1);
//   if (!workSheet)
//     return NextResponse.json({ message: "Неверный формат таблицы!" });

//   workSheet.getRow(1).eachCell((cell, colNumber) => {
//     workSheet.getColumn(colNumber).key = cell.text;
//   });

//   const productsData: Array<any> = [];

//   const [ placesCount, typesCount, places, types ] = await db.$transaction([
//     db.place.createMany({
//       data: [
//         ...Array.from(
//           new Set(
//             workSheet
//               .getColumn("Площадка")
//               .values.filter((v, i) => v !== null && i !== 1)
//           )
//         ).map((p) => ({ name: p!.toString() })),
//       ],
//     }),
//     db.type.createMany({
//       data: [
//         ...Array.from(
//           new Set(
//             workSheet
//               .getColumn("Тип")
//               .values.filter((v, i) => v !== null && i !== 1)
//               .map((t) => ({ name: t!.toString() }))
//           )
//         ),
//       ],
//     }),
//     db.place.findMany(),
//     db.type.findMany()
//   ]);

//   // places.forEach(place => {
//   //   const tableValues = workSheet.getSheetValues().filter((v, i) => v !== null && i !== 1)
//   //   const cabinetsIntoPlace = new Set(tableValues.filter(v => v[1] == place).map(v => (v[2])))
//   //   cabinetsIntoPlace.forEach(cabinet => {
//   //     const productsIntoCabinet = tableValues.filter(v => v[2] == cabinet).map(v => ({
//   //       type: types.find()
//   //     }))
//   //   })
//   //   console.log(cabinetsIntoPlace);
//   // })

//   await unlink(path);

//   return NextResponse.json({ message: "Импорт выполнен успешно!" });
// }
