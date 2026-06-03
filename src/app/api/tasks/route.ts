import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function getUserId(request: Request) {
  // 1. Try to get from Authorization header (used by Capacitor/Mobile)
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  
  // 2. Try to get from Cookie (used by Web)
  const cookieStore = await cookies();
  const userId = cookieStore.get("flow_session")?.value;
  return userId;
}

export async function GET(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      // Em produção real, você pode querer paginar ou limitar por data para não carregar 50.000 tarefas
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await request.json();
    
    // Evitar duplicatas (caso a requisição do Sync Engine repita sem querer)
    const existingTask = await prisma.task.findUnique({
      where: { id: body.id }
    });

    if (existingTask) {
      return NextResponse.json({ success: true, task: existingTask });
    }

    const task = await prisma.task.create({
      data: {
        id: body.id, // ID vem gerado do Dexie para manter consistencia
        title: body.title,
        description: body.description || null,
        startTime: body.startTime ? new Date(body.startTime) : null,
        endTime: body.endTime ? new Date(body.endTime) : null,
        isCompleted: body.isCompleted,
        category: body.category || "geral",
        userId,
        blockId: body.blockId || null,
        createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
        updatedAt: body.updatedAt ? new Date(body.updatedAt) : new Date(),
      },
    });

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json({ error: "Erro ao criar tarefa" }, { status: 500 });
  }
}
