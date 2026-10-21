"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reorderEntity, deleteEntity, requireString, requireId } from "@/lib/admin-helpers";

export async function createLeadership(formData: FormData) {
  const count = await prisma.leadership.count();
  const created = await prisma.leadership.create({
    data: {
      role: requireString(formData, "role"),
      place: requireString(formData, "place"),
      period: requireString(formData, "period"),
      text: requireString(formData, "text"),
      order: count,
    },
  });
  revalidatePath("/");
  redirect(`/admin/leadership?status=created#leadership-${created.id}`);
}

export async function updateLeadership(formData: FormData) {
  const id = requireId(formData);
  await prisma.leadership.update({
    where: { id },
    data: {
      role: requireString(formData, "role"),
      place: requireString(formData, "place"),
      period: requireString(formData, "period"),
      text: requireString(formData, "text"),
    },
  });
  revalidatePath("/");
  redirect(`/admin/leadership?status=saved#leadership-${id}`);
}

export async function deleteLeadership(formData: FormData) {
  const id = requireId(formData);
  await deleteEntity("leadership", id);
  revalidatePath("/");
  redirect("/admin/leadership?status=deleted");
}

export async function reorderLeadership(id: number, direction: "up" | "down") {
  await reorderEntity("leadership", id, direction);
  revalidatePath("/");
  revalidatePath("/admin/leadership");
}
