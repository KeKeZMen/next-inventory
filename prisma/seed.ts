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
    },
  });

  const owner = await prisma.user.create({
    data: {
      name: "root",
      password:
        "fbfb386efea67e816f2dda0a8c94a98eb203757aebb3f55f183755a192d44467", // 123qwe
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
