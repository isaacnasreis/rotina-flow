import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminName = process.env.ADMIN_NAME;
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPin = process.env.ADMIN_PIN;
  const adminName2 = process.env.ADMIN_NAME2;
  const adminUsername2 = process.env.ADMIN_USERNAME2;
  const adminPin2 = process.env.ADMIN_PIN2;

  if (!adminName || !adminUsername || !adminPin) {
    throw new Error(
      "Variáveis ADMIN_NAME ou ADMIN_USERNAME ou ADMIN_PIN não encontradas no .env",
    );
  }

  if (!adminName2 || !adminUsername2 || !adminPin2) {
    throw new Error(
      "Variáveis ADMIN_NAME2 ou ADMIN_USERNAME2 ou ADMIN_PIN2 não encontradas no .env",
    );
  }

  const user = await prisma.user.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      name: adminName,
      username: adminUsername,
      pin: adminPin,
      tasks: {
        create: [
          {
            title: "Treino e Foco Físico",
            description:
              "Academia ou corrida para começar o dia com energia e clareza mental.",
            startTime: new Date(new Date().setHours(7, 0, 0, 0)),
            endTime: new Date(new Date().setHours(8, 30, 0, 0)),
            category: "saude",
          },
          {
            title: "Estudos Frontend e UX",
            description:
              "Aprofundamento em arquitetura de software e interações fluidas.",
            startTime: new Date(new Date().setHours(10, 0, 0, 0)),
            endTime: new Date(new Date().setHours(12, 0, 0, 0)),
            category: "estudo",
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.upsert({
    where: { username: adminUsername2 },
    update: {},
    create: {
      name: adminName2,
      username: adminUsername2,
      pin: adminPin2,
      tasks: {
        create: [
          {
            title: "Prática de Artes Visuais",
            description:
              "Sessão de flow: fundamentos de desenho, storyboard ou animação 2D.",
            startTime: new Date(new Date().setHours(20, 0, 0, 0)),
            endTime: new Date(new Date().setHours(22, 0, 0, 0)),
            category: "lazer",
          },
        ],
      },
    },
  });

  console.log("Semente plantada no banco de dados:", user.username);
  console.log("Semente plantada no banco de dados:", user2.username);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
