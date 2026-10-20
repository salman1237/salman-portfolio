"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reorderEntity, deleteEntity, requireString, requireId } from "@/lib/admin-helpers";
import { saveUploadedImage, deleteUploadedImage, UploadError } from "@/lib/upload";

export async function updateProfile(formData: FormData) {
  const data: Record<string, string> = {
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

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    let photoUrl: string;
    try {
      photoUrl = await saveUploadedImage(photo);
    } catch (err) {
      if (err instanceof UploadError) {
        redirect(`/admin/profile?status=error&message=${encodeURIComponent(err.message)}`);
      }
      throw err;
    }
    const existing = await prisma.profile.findUnique({ where: { id: 1 } });
    await deleteUploadedImage(existing?.photoUrl);
    await prisma.profile.update({ where: { id: 1 }, data: { ...data, photoUrl } });
  } else if (formData.get("removePhoto") === "1") {
    const existing = await prisma.profile.findUnique({ where: { id: 1 } });
    await deleteUploadedImage(existing?.photoUrl);
    await prisma.profile.update({ where: { id: 1 }, data: { ...data, photoUrl: null } });
  } else {
    await prisma.profile.update({ where: { id: 1 }, data });
  }

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
