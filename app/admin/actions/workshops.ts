"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reorderEntity, deleteEntity, requireString, requireId } from "@/lib/admin-helpers";
import { deleteUploadedImage } from "@/lib/upload";

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
  const images = await prisma.workshopAttachment.findMany({
    where: { workshopId: id, type: "IMAGE" },
  });
  await Promise.all(images.map((a) => deleteUploadedImage(a.url)));
  await deleteEntity("workshop", id);
  revalidatePath("/");
  redirect("/admin/workshops?status=deleted");
}

export async function reorderWorkshop(id: number, direction: "up" | "down") {
  await reorderEntity("workshop", id, direction);
  revalidatePath("/");
  revalidatePath("/admin/workshops");
}

export async function createWorkshopAttachment(formData: FormData) {
  const workshopId = requireId(formData);
  const type = requireString(formData, "type");
  const urls = formData
    .getAll("url")
    .map((v) => String(v).trim())
    .filter(Boolean);
  if (urls.length === 0) throw new Error("url is required");
  const labelRaw = formData.get("label");
  const label = typeof labelRaw === "string" && labelRaw.trim() !== "" ? labelRaw.trim() : null;
  const count = await prisma.workshopAttachment.count({ where: { workshopId } });
  await prisma.workshopAttachment.createMany({
    data: urls.map((url, i) => ({ workshopId, type, label, url, order: count + i })),
  });
  revalidatePath("/");
  redirect(`/admin/workshops?status=created#workshop-${workshopId}`);
}

export async function deleteWorkshopAttachment(formData: FormData) {
  const id = requireId(formData);
  const workshopId = Number(formData.get("workshopId"));
  const existing = await prisma.workshopAttachment.findUnique({ where: { id } });
  if (existing?.type === "IMAGE") {
    await deleteUploadedImage(existing.url);
  }
  await deleteEntity("workshopAttachment", id);
  revalidatePath("/");
  redirect(`/admin/workshops?status=deleted#workshop-${workshopId}`);
}

export async function reorderWorkshopAttachment(id: number, direction: "up" | "down") {
  await reorderEntity("workshopAttachment", id, direction, "workshopId");
  revalidatePath("/");
  revalidatePath("/admin/workshops");
}
