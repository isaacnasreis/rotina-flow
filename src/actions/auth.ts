"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const pin = formData.get("pin") as string;

  if (!username || !pin) return { error: "Username e PIN são obrigatórios." };

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) return { error: "Usuário não encontrado." };

  if (user.pin !== pin) return { error: "PIN incorreto." };

  (await cookies()).set("flow_session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
  });

  redirect("/");
}

export async function logout() {
  (await cookies()).delete("flow_session");
  redirect("/");
}
