"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reorderEntity, deleteEntity, requireString, requireId } from "@/lib/admin-helpers";

export async function createAchievement(formData: FormData) {
  const text = requireString(formData, "text");
  const count = await prisma.achievement.count();
  const created = await prisma.achievement.create({ data: { text, order: count } });
  revalidatePath("/");
  redirect(`/admin/achievements?status=created#achievement-${created.id}`);
}

export async function updateAchievement(formData: FormData) {
  const id = requireId(formData);
  const text = requireString(formData, "text");
  await prisma.achievement.update({ where: { id }, data: { text } });
  revalidatePath("/");
  redirect(`/admin/achievements?status=saved#achievement-${id}`);
}

export async function deleteAchievement(formData: FormData) {
  const id = requireId(formData);
  await deleteEntity("achievement", id);
  revalidatePath("/");
  redirect("/admin/achievements?status=deleted");
}

export async function reorderAchievement(id: number, direction: "up" | "down") {
  await reorderEntity("achievement", id, direction);
  revalidatePath("/");
  revalidatePath("/admin/achievements");
}
