import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const ownerRight = await prisma.right.create({
    data: {
      name: "Owner",
      cabinetActions: true,
      placeActions: true,
      productActions: true,
      rightActions: true,
      userActions: true,
      typeActions: true,
      consumablesActions: true,
      orderSuccesing: true
    },
  });

  const owner = await prisma.user.create({
    data: {
      name: "adam",
      password:
        "7fb2476d3e4dc39e98039383059cf7599d94d9bc752059889c4aec348e0b276e",
      rightId: ownerRight.id,
    },
  });

  console.log({ owner, ownerRight });
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.log(e);
    prisma.$disconnect();
  });
