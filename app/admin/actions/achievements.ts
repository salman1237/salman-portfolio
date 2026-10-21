"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reorderEntity, deleteEntity, requireString, requireId } from "@/lib/admin-helpers";
import { deleteUploadedImage } from "@/lib/upload";

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
  const images = await prisma.achievementAttachment.findMany({
    where: { achievementId: id, type: "IMAGE" },
  });
  await Promise.all(images.map((a) => deleteUploadedImage(a.url)));
  await deleteEntity("achievement", id);
  revalidatePath("/");
  redirect("/admin/achievements?status=deleted");
}

export async function reorderAchievement(id: number, direction: "up" | "down") {
  await reorderEntity("achievement", id, direction);
  revalidatePath("/");
  revalidatePath("/admin/achievements");
}

export async function createAchievementAttachment(formData: FormData) {
  const achievementId = requireId(formData);
  const type = requireString(formData, "type");
  const urls = formData
    .getAll("url")
    .map((v) => String(v).trim())
    .filter(Boolean);
  if (urls.length === 0) throw new Error("url is required");
  const labelRaw = formData.get("label");
  const label = typeof labelRaw === "string" && labelRaw.trim() !== "" ? labelRaw.trim() : null;
  const count = await prisma.achievementAttachment.count({ where: { achievementId } });
  await prisma.achievementAttachment.createMany({
    data: urls.map((url, i) => ({ achievementId, type, label, url, order: count + i })),
  });
  revalidatePath("/");
  redirect(`/admin/achievements?status=created#achievement-${achievementId}`);
}

export async function deleteAchievementAttachment(formData: FormData) {
  const id = requireId(formData);
  const achievementId = Number(formData.get("achievementId"));
  const existing = await prisma.achievementAttachment.findUnique({ where: { id } });
  if (existing?.type === "IMAGE") {
    await deleteUploadedImage(existing.url);
  }
  await deleteEntity("achievementAttachment", id);
  revalidatePath("/");
  redirect(`/admin/achievements?status=deleted#achievement-${achievementId}`);
}

export async function reorderAchievementAttachment(id: number, direction: "up" | "down") {
  await reorderEntity("achievementAttachment", id, direction, "achievementId");
  revalidatePath("/");
  revalidatePath("/admin/achievements");
}
