"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reorderEntity, deleteEntity, requireString, requireId } from "@/lib/admin-helpers";

export async function createSkillGroup(formData: FormData) {
  const category = requireString(formData, "category");
  const count = await prisma.skillGroup.count();
  const created = await prisma.skillGroup.create({ data: { category, order: count } });
  revalidatePath("/");
  redirect(`/admin/skills?status=created#group-${created.id}`);
}

export async function updateSkillGroup(formData: FormData) {
  const id = requireId(formData);
  const category = requireString(formData, "category");
  await prisma.skillGroup.update({ where: { id }, data: { category } });
  revalidatePath("/");
  redirect(`/admin/skills?status=saved#group-${id}`);
}

export async function deleteSkillGroup(formData: FormData) {
  const id = requireId(formData);
  await deleteEntity("skillGroup", id);
  revalidatePath("/");
  redirect("/admin/skills?status=deleted");
}

export async function reorderSkillGroup(id: number, direction: "up" | "down") {
  await reorderEntity("skillGroup", id, direction);
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function createSkillItem(formData: FormData) {
  const skillGroupId = requireId(formData);
  const name = requireString(formData, "name");
  const count = await prisma.skillItem.count({ where: { skillGroupId } });
  const created = await prisma.skillItem.create({ data: { skillGroupId, name, order: count } });
  revalidatePath("/");
  redirect(`/admin/skills?status=created#item-${created.id}`);
}

export async function updateSkillItem(formData: FormData) {
  const id = requireId(formData);
  const name = requireString(formData, "name");
  await prisma.skillItem.update({ where: { id }, data: { name } });
  revalidatePath("/");
  redirect(`/admin/skills?status=saved#item-${id}`);
}

export async function deleteSkillItem(formData: FormData) {
  const id = requireId(formData);
  await deleteEntity("skillItem", id);
  revalidatePath("/");
  redirect("/admin/skills?status=deleted");
}

export async function reorderSkillItem(id: number, direction: "up" | "down") {
  await reorderEntity("skillItem", id, direction, "skillGroupId");
  revalidatePath("/");
  revalidatePath("/admin/skills");
}
