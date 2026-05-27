"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const OFFENSIVE_WORDS = [
  "porra", "caralho", "puta", "merda", "foder", "foda", "bosta", "viado", "corno", "fdp",
  "filho da puta", "arrombado", "otario", "otário", "imbecil", "retardado"
];

function hasOffensiveContent(text: string): boolean {
  if (!text) return false;
  const normalized = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return OFFENSIVE_WORDS.some(word => {
    const wordNormalized = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const regex = new RegExp(`\\b${wordNormalized}\\b`, "i");
    return regex.test(normalized) || normalized.includes(wordNormalized + "s");
  });
}

async function getSessionUserId() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("flow_session")?.value;
  if (!userId) throw new Error("Não autorizado");
  return userId;
}

function getTodayRange() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return { startOfDay, endOfDay };
}

function parseTime(timeStr: string): Date | null {
  const parts = timeStr.split(":").map(Number);
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), parts[0], parts[1]);
}

export async function createTask(
  title: string,
  options?: {
    description?: string;
    startTime?: string;
    endTime?: string;
    category?: string;
    blockId?: string;
  }
) {
  if (!title || !title.trim()) return { error: "O título é obrigatório." };
  if (title.length > 100) return { error: "Título muito longo (máx. 100 caracteres)." };

  const description = options?.description || "";
  if (description.length > 500) return { error: "Descrição muito longa (máx. 500 caracteres)." };

  if (hasOffensiveContent(title) || hasOffensiveContent(description)) {
    return { error: "O conteúdo contém termos ofensivos não permitidos." };
  }

  const userId = await getSessionUserId();
  const { startOfDay, endOfDay } = getTodayRange();

  const todayTasksCount = await prisma.task.count({
    where: {
      userId,
      createdAt: { gte: startOfDay, lte: endOfDay },
    },
  });

  if (todayTasksCount >= 15) {
    return { error: "Limite diário de 15 tarefas atingido." };
  }

  const startDate = options?.startTime ? parseTime(options.startTime) : null;
  const endDate = options?.endTime ? parseTime(options.endTime) : null;
  const blockId = options?.blockId && options.blockId !== "geral" ? options.blockId : null;

  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      description: description || null,
      startTime: startDate,
      endTime: endDate,
      category: options?.category || "geral",
      userId,
      ...(blockId ? { blockId } : {}),
    },
  });

  revalidatePath("/");
  return {
    success: "Tarefa adicionada.",
    task: {
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      isCompleted: task.isCompleted,
      category: task.category,
      blockId: task.blockId || undefined,
      startTime: task.startTime
        ? task.startTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        : undefined,
      endTime: task.endTime
        ? task.endTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        : undefined,
    },
  };
}

export async function toggleTaskStatus(id: string, currentStatus: boolean) {
  const userId = await getSessionUserId();
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) return { error: "Tarefa não encontrada." };

  await prisma.task.update({
    where: { id },
    data: { isCompleted: !currentStatus },
  });
  revalidatePath("/");
  return { success: currentStatus ? "Tarefa restaurada." : "Tarefa concluída!" };
}

export async function deleteTask(id: string) {
  const userId = await getSessionUserId();
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) return { error: "Tarefa não encontrada." };

  await prisma.task.delete({ where: { id } });
  revalidatePath("/");
  return { success: "Tarefa removida." };
}

export async function updateTask(
  id: string,
  updates: {
    title?: string;
    description?: string;
    startTime?: string | null;
    endTime?: string | null;
    category?: string;
  }
) {
  const userId = await getSessionUserId();
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) return { error: "Tarefa não encontrada." };

  if (updates.title !== undefined) {
    if (!updates.title.trim()) return { error: "O título é obrigatório." };
    if (hasOffensiveContent(updates.title)) {
      return { error: "O conteúdo contém termos ofensivos não permitidos." };
    }
  }

  const data: Record<string, unknown> = {};
  if (updates.title !== undefined) data.title = updates.title.trim();
  if (updates.description !== undefined) data.description = updates.description || null;
  if (updates.category !== undefined) data.category = updates.category;
  if (updates.startTime !== undefined) {
    data.startTime = updates.startTime ? parseTime(updates.startTime) : null;
  }
  if (updates.endTime !== undefined) {
    data.endTime = updates.endTime ? parseTime(updates.endTime) : null;
  }

  await prisma.task.update({ where: { id }, data });
  revalidatePath("/");
  return { success: "Tarefa atualizada." };
}

export async function completeAllTasks() {
  const userId = await getSessionUserId();
  const { startOfDay, endOfDay } = getTodayRange();

  await prisma.task.updateMany({
    where: {
      userId,
      isCompleted: false,
      createdAt: { lte: endOfDay },
    },
    data: { isCompleted: true },
  });

  revalidatePath("/");
  return { success: "Todas as tarefas foram concluídas!" };
}

export async function deleteAllTasks() {
  const userId = await getSessionUserId();
  const { startOfDay, endOfDay } = getTodayRange();

  await prisma.task.deleteMany({
    where: {
      userId,
      OR: [
        { createdAt: { gte: startOfDay, lte: endOfDay } },
        { isCompleted: false, createdAt: { lt: startOfDay } },
        { updatedAt: { gte: startOfDay }, createdAt: { lt: startOfDay } },
      ],
    },
  });

  revalidatePath("/");
  return { success: "Todas as tarefas foram removidas." };
}
