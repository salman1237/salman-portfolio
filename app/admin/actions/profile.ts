"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reorderEntity, deleteEntity, requireString, requireId } from "@/lib/admin-helpers";
import { deleteUploadedImage } from "@/lib/upload";

export async function updateProfile(formData: FormData) {
  const data: Record<string, string | null> = {
    name: requireString(formData, "name"),
    role: requireString(formData, "role"),
    tagline: requireString(formData, "tagline"),
    location: requireString(formData, "location"),
    currently: requireString(formData, "currently"),
    studying: requireString(formData, "studying"),
    email: requireString(formData, "email"),
    phone: requireString(formData, "phone"),
    linkedin: requireString(formData, "linkedin"),
    github: requireString(formData, "github"),
    codeforces: requireString(formData, "codeforces"),
    leetcode: requireString(formData, "leetcode"),
  };

  // The file itself already landed on disk via /api/admin/upload (see
  // ImageUploadField) — this field is just the resulting URL string.
  const uploadedUrl = formData.get("photo");
  if (typeof uploadedUrl === "string" && uploadedUrl.trim() !== "") {
    const existing = await prisma.profile.findUnique({ where: { id: 1 } });
    await deleteUploadedImage(existing?.photoUrl);
    data.photoUrl = uploadedUrl;
  } else if (formData.get("removePhoto") === "1") {
    const existing = await prisma.profile.findUnique({ where: { id: 1 } });
    await deleteUploadedImage(existing?.photoUrl);
    data.photoUrl = null;
  }

  await prisma.profile.update({ where: { id: 1 }, data });
  revalidatePath("/");
  redirect("/admin/profile?status=saved");
}

export async function createAbout(formData: FormData) {
  const text = requireString(formData, "text");
  const count = await prisma.aboutParagraph.count();
  await prisma.aboutParagraph.create({ data: { text, order: count } });
  revalidatePath("/");
  redirect("/admin/profile?status=created");
}

export async function updateAbout(formData: FormData) {
  const id = requireId(formData);
  const text = requireString(formData, "text");
  await prisma.aboutParagraph.update({ where: { id }, data: { text } });
  revalidatePath("/");
  redirect("/admin/profile?status=saved");
}

export async function deleteAbout(formData: FormData) {
  const id = requireId(formData);
  await deleteEntity("aboutParagraph", id);
  revalidatePath("/");
  redirect("/admin/profile?status=deleted");
}

export async function reorderAbout(id: number, direction: "up" | "down") {
  await reorderEntity("aboutParagraph", id, direction);
  revalidatePath("/");
  revalidatePath("/admin/profile");
}
