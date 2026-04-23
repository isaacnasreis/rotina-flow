"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { cookies } from "next/headers";

export async function generateShareToken() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("flow_session")?.value;
  if (!userId) throw new Error("Não autorizado");

  const existingAccess = await prisma.sharedAccess.findFirst({
    where: { ownerId: userId },
  });

  if (existingAccess) {
    return existingAccess.accessToken;
  }

  const newToken = crypto.randomBytes(16).toString("hex");

  await prisma.sharedAccess.create({
    data: {
      ownerId: userId,
      accessToken: newToken,
    },
  });

  return newToken;
}

export async function revokeShareToken() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("flow_session")?.value;
  if (!userId) throw new Error("Não autorizado");

  await prisma.sharedAccess.deleteMany({
    where: { ownerId: userId },
  });
}
