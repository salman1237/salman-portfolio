import { prisma } from "@/lib/prisma";
import { input, textarea, label, card, buttonPrimary, buttonDanger } from "@/lib/admin-ui";
import StatusBanner from "@/components/admin/StatusBanner";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import ReorderButtons from "@/components/admin/ReorderButtons";
import ImageUploadField from "@/components/admin/ImageUploadField";
import {
  updateProfile,
  createAbout,
  updateAbout,
  deleteAbout,
  reorderAbout,
} from "@/app/admin/actions/profile";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; message?: string }>;
}) {
  const { status, message } = await searchParams;
  const [profile, about] = await Promise.all([
    prisma.profile.findUnique({ where: { id: 1 } }),
    prisma.aboutParagraph.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!profile) return <p>Profile row is missing — run the seed script.</p>;

  return (
    <div>
      <StatusBanner status={status} message={message} />
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Profile.
      </h1>

      <form action={updateProfile} className={`${card} mt-6 flex flex-col gap-4`}>
        <ImageUploadField
          name="photo"
          removeFieldName="removePhoto"
          label="Photo"
          currentUrl={profile.photoUrl}
          aspect="aspect-square"
        />
        <Field name="name" labelText="Name" defaultValue={profile.name} />
        <Field name="role" labelText="Role" defaultValue={profile.role} />
        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="tagline">Tagline</label>
          <textarea id="tagline" name="tagline" defaultValue={profile.tagline} className={textarea} required />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field name="location" labelText="Location" defaultValue={profile.location} />
          <Field name="currently" labelText="Currently" defaultValue={profile.currently} />
          <Field name="studying" labelText="Studying" defaultValue={profile.studying} />
          <Field name="email" labelText="Email" defaultValue={profile.email} type="email" />
          <Field name="phone" labelText="Phone" defaultValue={profile.phone} />
          <Field name="linkedin" labelText="LinkedIn URL" defaultValue={profile.linkedin} />
          <Field name="github" labelText="GitHub URL" defaultValue={profile.github} />
          <Field name="codeforces" labelText="Codeforces URL" defaultValue={profile.codeforces} />
          <Field name="leetcode" labelText="LeetCode URL" defaultValue={profile.leetcode} />
        </div>
        <button type="submit" className={`${buttonPrimary} self-start`}>
          Save profile
        </button>
      </form>

      <h2 className="mt-12 font-display text-2xl font-extrabold tracking-tight">
        About paragraphs.
      </h2>
      <div className="mt-5 flex flex-col gap-4">
        {about.map((p, i) => (
          <div key={p.id} className={`${card} flex gap-4`}>
            <form action={updateAbout} className="flex min-w-0 flex-1 flex-col gap-3">
              <input type="hidden" name="id" value={p.id} />
              <textarea name="text" defaultValue={p.text} className={textarea} required />
              <div className="flex flex-wrap gap-3">
                <button type="submit" className={buttonPrimary}>Save</button>
              </div>
            </form>
            <form action={deleteAbout}>
              <input type="hidden" name="id" value={p.id} />
              <ConfirmSubmitButton confirmText="Delete this paragraph?" className={buttonDanger}>
                Delete
              </ConfirmSubmitButton>
            </form>
            <ReorderButtons
              id={p.id}
              disableUp={i === 0}
              disableDown={i === about.length - 1}
              reorder={reorderAbout}
            />
          </div>
        ))}
      </div>

      <form action={createAbout} className={`${card} mt-4 flex flex-col gap-3`}>
        <label className={label} htmlFor="new-about">Add a paragraph</label>
        <textarea id="new-about" name="text" className={textarea} required />
        <button type="submit" className={`${buttonPrimary} self-start`}>
          Add paragraph
        </button>
      </form>
    </div>
  );
}

function Field({
  name,
  labelText,
  defaultValue,
  type = "text",
}: {
  name: string;
  labelText: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={label} htmlFor={name}>{labelText}</label>
      <input id={name} name={name} type={type} defaultValue={defaultValue} className={input} required />
    </div>
  );
}
