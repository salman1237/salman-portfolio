"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reorderEntity, deleteEntity, requireString, requireId } from "@/lib/admin-helpers";
import { saveUploadedImage, deleteUploadedImage, UploadError } from "@/lib/upload";

export async function createProject(formData: FormData) {
  const count = await prisma.project.count();

  let coverImageUrl: string | undefined;
  const coverImage = formData.get("coverImage");
  if (coverImage instanceof File && coverImage.size > 0) {
    try {
      coverImageUrl = await saveUploadedImage(coverImage);
    } catch (err) {
      if (err instanceof UploadError) {
        redirect(`/admin/projects?status=error&message=${encodeURIComponent(err.message)}`);
      }
      throw err;
    }
  }

  await prisma.project.create({
    data: {
      name: requireString(formData, "name"),
      tagline: requireString(formData, "tagline"),
      stack: requireString(formData, "stack"),
      dark: formData.get("dark") === "on",
      order: count,
      coverImageUrl,
    },
  });
  revalidatePath("/");
  redirect("/admin/projects?status=created");
}

export async function updateProject(formData: FormData) {
  const id = requireId(formData);
  const data: Record<string, unknown> = {
    name: requireString(formData, "name"),
    tagline: requireString(formData, "tagline"),
    stack: requireString(formData, "stack"),
    dark: formData.get("dark") === "on",
  };

  const coverImage = formData.get("coverImage");
  if (coverImage instanceof File && coverImage.size > 0) {
    let coverImageUrl: string;
    try {
      coverImageUrl = await saveUploadedImage(coverImage);
    } catch (err) {
      if (err instanceof UploadError) {
        redirect(`/admin/projects?status=error&message=${encodeURIComponent(err.message)}`);
      }
      throw err;
    }
    const existing = await prisma.project.findUnique({ where: { id } });
    await deleteUploadedImage(existing?.coverImageUrl);
    data.coverImageUrl = coverImageUrl;
  } else if (formData.get("removeCoverImage") === "1") {
    const existing = await prisma.project.findUnique({ where: { id } });
    await deleteUploadedImage(existing?.coverImageUrl);
    data.coverImageUrl = null;
  }

  await prisma.project.update({ where: { id }, data });
  revalidatePath("/");
  redirect("/admin/projects?status=saved");
}

export async function deleteProject(formData: FormData) {
  const id = requireId(formData);
  const existing = await prisma.project.findUnique({ where: { id } });
  await deleteUploadedImage(existing?.coverImageUrl);
  await deleteEntity("project", id);
  revalidatePath("/");
  redirect("/admin/projects?status=deleted");
}

export async function reorderProject(id: number, direction: "up" | "down") {
  await reorderEntity("project", id, direction);
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function createProjectBullet(formData: FormData) {
  const projectId = requireId(formData);
  const text = requireString(formData, "text");
  const count = await prisma.projectBullet.count({ where: { projectId } });
  await prisma.projectBullet.create({ data: { projectId, text, order: count } });
  revalidatePath("/");
  redirect("/admin/projects?status=created");
}

export async function updateProjectBullet(formData: FormData) {
  const id = requireId(formData);
  const text = requireString(formData, "text");
  await prisma.projectBullet.update({ where: { id }, data: { text } });
  revalidatePath("/");
  redirect("/admin/projects?status=saved");
}

export async function deleteProjectBullet(formData: FormData) {
  const id = requireId(formData);
  await deleteEntity("projectBullet", id);
  revalidatePath("/");
  redirect("/admin/projects?status=deleted");
}

export async function reorderProjectBullet(id: number, direction: "up" | "down") {
  await reorderEntity("projectBullet", id, direction, "projectId");
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function createProjectLink(formData: FormData) {
  const projectId = requireId(formData);
  const label = requireString(formData, "label");
  const href = requireString(formData, "href");
  const count = await prisma.projectLink.count({ where: { projectId } });
  await prisma.projectLink.create({ data: { projectId, label, href, order: count } });
  revalidatePath("/");
  redirect("/admin/projects?status=created");
}

export async function updateProjectLink(formData: FormData) {
  const id = requireId(formData);
  const label = requireString(formData, "label");
  const href = requireString(formData, "href");
  await prisma.projectLink.update({ where: { id }, data: { label, href } });
  revalidatePath("/");
  redirect("/admin/projects?status=saved");
}

export async function deleteProjectLink(formData: FormData) {
  const id = requireId(formData);
  await deleteEntity("projectLink", id);
  revalidatePath("/");
  redirect("/admin/projects?status=deleted");
}

export async function reorderProjectLink(id: number, direction: "up" | "down") {
  await reorderEntity("projectLink", id, direction, "projectId");
  revalidatePath("/");
  revalidatePath("/admin/projects");
}
