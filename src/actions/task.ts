"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  // const time = formData.get("time") as string;
  const category = formData.get("category") as string;

  if (!title) return { error: "O título é obrigatório." };

  const cookieStore = await cookies();
  const userId = cookieStore.get("flow_session")?.value;

  if (!userId) throw new Error("Não autorizado");

  await prisma.task.create({
    data: {
      title,
      description,
      startTime: new Date(),
      endTime: new Date(),
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
