import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/shared";
import { getServerSession } from "next-auth";
import Exceljs from "exceljs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { cabinetId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const right = await db.right.findFirst({
    where: {
      id: session.user.rightId,
    },
  });

  if (!right?.cabinetActions || !right.productActions)
    return Response.json({ message: "Недостаточно прав" }, { status: 401 });

  const cabinetData = await db.cabinet.findFirst({
    where: {
      id: parseInt(params.cabinetId),
    },
    select: {
      name: true,
      users: {
        select: {
          name: true
        }
      },
      products: {
        select: {
          name: true,
          inventoryNumber: true,
          serialNumber: true,
          type: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!cabinetData)
    return NextResponse.json({ message: "Нет данных" }, { status: 500 });

  const workbook = new Exceljs.Workbook();
  const worksheet = workbook.addWorksheet("Паспорт");
  const borderStyle: Partial<Exceljs.Borders> = {
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
    top: { style: "thin" },
  };
  worksheet.columns = [
    { width: 3 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
  ];

  const headerRow = worksheet.addRow([
    `Инвентарная ведомость на технические средства обучения учебного кабинета № ${cabinetData.name}`,
  ]);
  headerRow.alignment = {
    horizontal: "center",
  };
  worksheet.mergeCells("A1", "E1");

  worksheet.addRow("");

  const columsHeaderRow = worksheet.addRow([
    "№",
    "Наименование ТСО",
    "Марка",
    "Инвентарный №",
    "Серийный №",
  ]);
  columsHeaderRow.border = borderStyle;

  cabinetData.products.forEach((product, index) => {
    const productRow = worksheet.addRow([
      index + 1,
      product.type.name,
      product.name,
      product.inventoryNumber,
      product.serialNumber,
    ]);
    productRow.border = borderStyle;
  });

  worksheet.addRow("");

  if(cabinetData.users?.name) {
    const footerRow = worksheet.addRow([
      `Ответственный за ${cabinetData.name} кабинет: ${cabinetData.users.name} / ______________________`,
    ]);
    footerRow.alignment = {
      horizontal: "center",
    };
  }

  worksheet.mergeCells(
    `A${cabinetData.products.length + 5}`,
    `E${cabinetData.products.length + 5}`
  );

  const workBookBuf = (await workbook.xlsx.writeBuffer()) as Buffer;

  return new Response(workBookBuf);
}
