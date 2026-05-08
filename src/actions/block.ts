"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getUserId() {
  const cookieStore = await cookies();
  return cookieStore.get("flow_session")?.value;
}

export async function createBlock(name: string) {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Não autorizado" };

    if (!name || name.trim() === "") {
      return { error: "O nome do bloco é obrigatório" };
    }

    // Get highest order to append to the end
    const lastBlock = await prisma.block.findFirst({
      where: { userId },
      orderBy: { order: "desc" },
    });
    
    const newOrder = lastBlock ? lastBlock.order + 1 : 0;

    await prisma.block.create({
      data: {
        name: name.trim(),
        userId,
        order: newOrder,
      },
    });

    revalidatePath("/");
    return { success: "Bloco criado com sucesso!" };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao criar bloco" };
  }
}

export async function deleteBlock(blockId: string) {
  try {
    const userId = await getUserId();
    if (!userId) return { error: "Não autorizado" };

    await prisma.block.delete({
      where: { id: blockId, userId },
    });

    revalidatePath("/");
    return { success: "Bloco eliminado!" };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao eliminar bloco" };
  }
}
