"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reorderEntity, deleteEntity, requireString, requireId } from "@/lib/admin-helpers";

export async function createCpStat(formData: FormData) {
  const count = await prisma.cpStat.count();
  const created = await prisma.cpStat.create({
    data: {
      platform: requireString(formData, "platform"),
      value: requireString(formData, "value"),
      handle: requireString(formData, "handle"),
      order: count,
    },
  });
  revalidatePath("/");
  redirect(`/admin/cp-stats?status=created#stat-${created.id}`);
}

export async function updateCpStat(formData: FormData) {
  const id = requireId(formData);
  await prisma.cpStat.update({
    where: { id },
    data: {
      platform: requireString(formData, "platform"),
      value: requireString(formData, "value"),
      handle: requireString(formData, "handle"),
    },
  });
  revalidatePath("/");
  redirect(`/admin/cp-stats?status=saved#stat-${id}`);
}

export async function deleteCpStat(formData: FormData) {
  const id = requireId(formData);
  await deleteEntity("cpStat", id);
  revalidatePath("/");
  redirect("/admin/cp-stats?status=deleted");
}

export async function reorderCpStat(id: number, direction: "up" | "down") {
  await reorderEntity("cpStat", id, direction);
  revalidatePath("/");
  revalidatePath("/admin/cp-stats");
}
