import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function getUserId(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  
  const cookieStore = await cookies();
  return cookieStore.get("flow_session")?.value;
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const params = await context.params;
    const { id } = params;
    
    // Validate ownership
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask || existingTask.userId !== userId) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
    }

    const body = await request.json();
    
    const task = await prisma.task.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : undefined,
        description: body.description !== undefined ? body.description : undefined,
        startTime: body.startTime !== undefined ? (body.startTime ? new Date(body.startTime) : null) : undefined,
        endTime: body.endTime !== undefined ? (body.endTime ? new Date(body.endTime) : null) : undefined,
        isCompleted: body.isCompleted !== undefined ? body.isCompleted : undefined,
        category: body.category !== undefined ? body.category : undefined,
        blockId: body.blockId !== undefined ? body.blockId : undefined,
        updatedAt: body.updatedAt ? new Date(body.updatedAt) : new Date(),
      },
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error(`PATCH /api/tasks/[id] error:`, error);
    return NextResponse.json({ error: "Erro ao atualizar tarefa" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const params = await context.params;
    const { id } = params;

    // Validate ownership
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask || existingTask.userId !== userId) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
    }

    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/tasks/[id] error:`, error);
    return NextResponse.json({ error: "Erro ao deletar tarefa" }, { status: 500 });
  }
}
