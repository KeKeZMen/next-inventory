import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Exceljs from "exceljs";
import { db } from "@/shared";
import { authOptions } from "@/shared/lib/authOptions";

export async function GET(
  req: Request,
  { params }: { params: { typeId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return NextResponse.json({ message: "Вы не авторизованы!" });

  const typeData = await db.type.findFirst({
    where: {
      id: parseInt(params.typeId),
    },
  });

  if (!typeData)
    return NextResponse.json({ message: "Нет данных" }, { status: 500 });

  const workbook = new Exceljs.Workbook();
  const worksheet = workbook.addWorksheet("Типы");
  const borderStyle: Partial<Exceljs.Borders> = {
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
    top: { style: "thin" },
  };

  const workBookBuf = (await workbook.xlsx.writeBuffer()) as Buffer;

  return new Response(workBookBuf);
}
