"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reorderEntity, deleteEntity, requireString, requireId } from "@/lib/admin-helpers";

export async function createEducation(formData: FormData) {
  const count = await prisma.education.count();
  const created = await prisma.education.create({
    data: {
      school: requireString(formData, "school"),
      location: requireString(formData, "location"),
      degree: requireString(formData, "degree"),
      period: requireString(formData, "period"),
      order: count,
    },
  });
  revalidatePath("/");
  redirect(`/admin/education?status=created#education-${created.id}`);
}

export async function updateEducation(formData: FormData) {
  const id = requireId(formData);
  await prisma.education.update({
    where: { id },
    data: {
      school: requireString(formData, "school"),
      location: requireString(formData, "location"),
      degree: requireString(formData, "degree"),
      period: requireString(formData, "period"),
    },
  });
  revalidatePath("/");
  redirect(`/admin/education?status=saved#education-${id}`);
}

export async function deleteEducation(formData: FormData) {
  const id = requireId(formData);
  await deleteEntity("education", id);
  revalidatePath("/");
  redirect("/admin/education?status=deleted");
}

export async function reorderEducation(id: number, direction: "up" | "down") {
  await reorderEntity("education", id, direction);
  revalidatePath("/");
  revalidatePath("/admin/education");
}
