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
  const normalized = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove acentos
  return OFFENSIVE_WORDS.some(word => {
    const wordNormalized = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const regex = new RegExp(`\\b${wordNormalized}\\b`, "i");
    return regex.test(normalized) || normalized.includes(wordNormalized + "s");
  });
}

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startTimeStr = formData.get("startTime") as string;
  const endTimeStr = formData.get("endTime") as string;
  const category = formData.get("category") as string;
  const blockId = formData.get("blockId") as string | null;

  if (!title) return { error: "O título é obrigatório." };

  if (!startTimeStr || !endTimeStr) {
    return { error: "Os horários de início e fim são obrigatórios." };
  }

  if (hasOffensiveContent(title) || hasOffensiveContent(description)) {
    return { error: "O conteúdo contém termos ofensivos não permitidos." };
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("flow_session")?.value;

  if (!userId) throw new Error("Não autorizado");

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const todayTasksCount = await prisma.task.count({
    where: {
      userId,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (todayTasksCount >= 15) {
    return { error: "Limite diário de 15 tarefas atingido para este usuário." };
  }

  const [startHour, startMin] = startTimeStr.split(":").map(Number);
  const startDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    startHour,
    startMin,
  );

  const [endHour, endMin] = endTimeStr.split(":").map(Number);
  const endDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    endHour,
    endMin,
  );

  await prisma.task.create({
    data: {
      title,
      description,
      startTime: startDate,
      endTime: endDate,
      category: category || "deepwork",
      userId,
      ...(blockId && blockId !== "geral" ? { blockId } : {}),
    },
  });

  revalidatePath("/");
  return { success: "Bloco injetado no fluxo." };
}

export async function toggleTaskStatus(id: string, currentStatus: boolean) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("flow_session")?.value;
  if (!userId) return { error: "Não autorizado" };

  const task = await prisma.task.findFirst({
    where: { id, userId },
  });
  if (!task) return { error: "Tarefa não encontrada ou não autorizada" };

  await prisma.task.update({
    where: { id },
    data: { isCompleted: !currentStatus },
  });
  revalidatePath("/");
  return { success: currentStatus ? "Bloco restaurado." : "Bloco concluído." };
}

export async function deleteTask(id: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("flow_session")?.value;
  if (!userId) return { error: "Não autorizado" };

  const task = await prisma.task.findFirst({
    where: { id, userId },
  });
  if (!task) return { error: "Tarefa não encontrada ou não autorizada" };

  await prisma.task.delete({
    where: { id },
  });
  revalidatePath("/");
  return { success: "Bloco eliminado." };
}

export async function updateTask(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startTimeStr = formData.get("startTime") as string;
  const endTimeStr = formData.get("endTime") as string;

  if (!title) return { error: "O título é obrigatório." };
  if (!startTimeStr || !endTimeStr) {
    return { error: "Os horários são obrigatórios." };
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("flow_session")?.value;
  if (!userId) return { error: "Não autorizado" };

  const task = await prisma.task.findFirst({
    where: { id, userId },
  });
  if (!task) return { error: "Tarefa não encontrada ou não autorizada" };

  const now = new Date();
  const [startHour, startMin] = startTimeStr.split(":").map(Number);
  const startDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    startHour,
    startMin,
  );

  const [endHour, endMin] = endTimeStr.split(":").map(Number);
  const endDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    endHour,
    endMin,
  );

  await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      startTime: startDate,
      endTime: endDate,
    },
  });

  revalidatePath("/");
  return { success: "Bloco atualizado com sucesso." };
}

export async function completeAllTasks() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("flow_session")?.value;
  if (!userId) return { error: "Não autorizado" };

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  await prisma.task.updateMany({
    where: {
      userId,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    data: { isCompleted: true },
  });

  revalidatePath("/");
  return { success: "Todos os fluxos foram concluídos." };
}

export async function deleteAllTasks() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("flow_session")?.value;
  if (!userId) return { error: "Não autorizado" };

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  await prisma.task.deleteMany({
    where: {
      userId,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  revalidatePath("/");
  return { success: "Todos os fluxos foram eliminados." };
}
