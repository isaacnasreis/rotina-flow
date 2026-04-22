"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  // const time = formData.get("time") as string;
  const category = formData.get("category") as string;

  if (!title) return { error: "O título é obrigatório." };

  let user = await prisma.user.findFirst();

  if (!user) {
    user = await prisma.user.create({
      name: "Admin Isaac",
      username: "adminisaac",
      pin: "1234",
    });
  }

  await prisma.task.create({
    data: {
      title,
      description,
      startTime: new Date(),
      endTime: new Date(),
      category: category || "geral",
      userId: user.id,
    },
  });

  revalidatePath("/");
}
