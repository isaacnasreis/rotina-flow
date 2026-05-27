import { prisma } from "../src/lib/prisma";

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
            category: "recharge",
          },
          {
            title: "Estudos Frontend e UX",
            description:
              "Aprofundamento em arquitetura de software e interações fluidas.",
            startTime: new Date(new Date().setHours(10, 0, 0, 0)),
            endTime: new Date(new Date().setHours(12, 0, 0, 0)),
            category: "deepwork",
          },
          {
            title: "Revisar Pull Requests",
            category: "ops",
          },
          {
            title: "Ler artigo sobre design systems",
            description: "Explorar tendências de design tokens e theming.",
            category: "flow",
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
            category: "flow",
          },
          {
            title: "Organizar mesa e materiais",
            category: "ops",
          },
        ],
      },
    },
  });

  // Convidado 1 (convidado / PIN: 0000)
  const guest1 = await prisma.user.upsert({
    where: { username: "convidado" },
    update: {},
    create: {
      name: "Visitante Alpha",
      username: "convidado",
      pin: "0000",
      tasks: {
        create: [
          {
            title: "Café e Planejamento Diário",
            description: "Definir os focos e blocos de tempo para o dia de hoje.",
            startTime: new Date(new Date().setHours(9, 0, 0, 0)),
            endTime: new Date(new Date().setHours(9, 30, 0, 0)),
            category: "recharge",
          },
          {
            title: "Explorar o Rotina Flow",
            description: "Testar a criação, edição, toggle e exclusão de tarefas.",
            category: "deepwork",
          },
          {
            title: "Enviar Feedback do Projeto",
            description: "Deixar uma nota rápida ou sugestões sobre a experiência e UX.",
            startTime: new Date(new Date().setHours(14, 0, 0, 0)),
            endTime: new Date(new Date().setHours(14, 30, 0, 0)),
            category: "connect",
          },
          {
            title: "Comprar café",
            category: "ops",
          },
        ],
      },
    },
  });

  // Convidado 2 (tester / PIN: 1234)
  const guest2 = await prisma.user.upsert({
    where: { username: "tester" },
    update: {},
    create: {
      name: "Visitante Beta",
      username: "tester",
      pin: "1234",
      tasks: {
        create: [
          {
            title: "Análise de Arquitetura",
            description: "Revisar a estrutura de pastas e as Server Actions do Next.js.",
            startTime: new Date(new Date().setHours(14, 0, 0, 0)),
            endTime: new Date(new Date().setHours(15, 30, 0, 0)),
            category: "deepwork",
          },
          {
            title: "Coffee Break / Networking",
            description: "Momento para descontrair e conectar com o time.",
            startTime: new Date(new Date().setHours(16, 0, 0, 0)),
            endTime: new Date(new Date().setHours(16, 30, 0, 0)),
            category: "connect",
          },
          {
            title: "Responder mensagens pendentes",
            category: "ops",
          },
        ],
      },
    },
  });

  console.log("Semente plantada no banco de dados:", user.username);
  console.log("Semente plantada no banco de dados:", user2.username);
  console.log("Semente de visitante criada:", guest1.username);
  console.log("Semente de visitante criada:", guest2.username);
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
