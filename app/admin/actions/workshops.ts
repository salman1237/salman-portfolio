"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reorderEntity, deleteEntity, requireString, requireId } from "@/lib/admin-helpers";

export async function createWorkshop(formData: FormData) {
  const count = await prisma.workshop.count();
  const created = await prisma.workshop.create({
    data: {
      title: requireString(formData, "title"),
      organizer: requireString(formData, "organizer"),
      period: requireString(formData, "period"),
      order: count,
    },
  });
  revalidatePath("/");
  redirect(`/admin/workshops?status=created#workshop-${created.id}`);
}

export async function updateWorkshop(formData: FormData) {
  const id = requireId(formData);
  await prisma.workshop.update({
    where: { id },
    data: {
      title: requireString(formData, "title"),
      organizer: requireString(formData, "organizer"),
      period: requireString(formData, "period"),
    },
  });
  revalidatePath("/");
  redirect(`/admin/workshops?status=saved#workshop-${id}`);
}

export async function deleteWorkshop(formData: FormData) {
  const id = requireId(formData);
  await deleteEntity("workshop", id);
  revalidatePath("/");
  redirect("/admin/workshops?status=deleted");
}

export async function reorderWorkshop(id: number, direction: "up" | "down") {
  await reorderEntity("workshop", id, direction);
  revalidatePath("/");
  revalidatePath("/admin/workshops");
}
