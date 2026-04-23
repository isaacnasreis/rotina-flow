"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const startTimeStr = formData.get("startTime") as string;
  const endTimeStr = formData.get("endTime") as string;

  if (!title) return { error: "O título é obrigatório." };

  if (!startTimeStr || !endTimeStr) {
    return { error: "Os horários de início e fim são obrigatórios." };
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("flow_session")?.value;

  if (!userId) throw new Error("Não autorizado");

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

  await prisma.task.create({
    data: {
      title,
      description,
      startTime: startDate,
      endTime: endDate,
      category: category || "geral",
      userId: userId,
    },
  });

  revalidatePath("/");
}

export async function toggleTaskStatus(id: string, currentStatus: boolean) {
  await prisma.task.update({
    where: { id },
    data: { isCompleted: !currentStatus },
  });
  revalidatePath("/");
}

export async function deleteTask(id: string) {
  await prisma.task.delete({
    where: { id },
  });
  revalidatePath("/");
}
