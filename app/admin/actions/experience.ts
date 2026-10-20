"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reorderEntity, deleteEntity, requireString, requireId } from "@/lib/admin-helpers";

export async function createExperience(formData: FormData) {
  const count = await prisma.experience.count();
  await prisma.experience.create({
    data: {
      role: requireString(formData, "role"),
      company: requireString(formData, "company"),
      period: requireString(formData, "period"),
      order: count,
    },
  });
  revalidatePath("/");
  redirect("/admin/experience?status=created");
}

export async function updateExperience(formData: FormData) {
  const id = requireId(formData);
  await prisma.experience.update({
    where: { id },
    data: {
      role: requireString(formData, "role"),
      company: requireString(formData, "company"),
      period: requireString(formData, "period"),
    },
  });
  revalidatePath("/");
  redirect("/admin/experience?status=saved");
}

export async function deleteExperience(formData: FormData) {
  const id = requireId(formData);
  await deleteEntity("experience", id);
  revalidatePath("/");
  redirect("/admin/experience?status=deleted");
}

export async function reorderExperience(id: number, direction: "up" | "down") {
  await reorderEntity("experience", id, direction);
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function createExperienceBullet(formData: FormData) {
  const experienceId = requireId(formData);
  const text = requireString(formData, "text");
  const count = await prisma.experienceBullet.count({ where: { experienceId } });
  await prisma.experienceBullet.create({ data: { experienceId, text, order: count } });
  revalidatePath("/");
  redirect("/admin/experience?status=created");
}

export async function updateExperienceBullet(formData: FormData) {
  const id = requireId(formData);
  const text = requireString(formData, "text");
  await prisma.experienceBullet.update({ where: { id }, data: { text } });
  revalidatePath("/");
  redirect("/admin/experience?status=saved");
}

export async function deleteExperienceBullet(formData: FormData) {
  const id = requireId(formData);
  await deleteEntity("experienceBullet", id);
  revalidatePath("/");
  redirect("/admin/experience?status=deleted");
}

export async function reorderExperienceBullet(id: number, direction: "up" | "down") {
  await reorderEntity("experienceBullet", id, direction, "experienceId");
  revalidatePath("/");
  revalidatePath("/admin/experience");
}
