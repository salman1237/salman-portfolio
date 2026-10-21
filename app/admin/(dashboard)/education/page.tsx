import { prisma } from "@/lib/prisma";
import { input, label, card, buttonPrimary, buttonDanger } from "@/lib/admin-ui";
import StatusBanner from "@/components/admin/StatusBanner";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import ReorderButtons from "@/components/admin/ReorderButtons";
import {
  createEducation,
  updateEducation,
  deleteEducation,
  reorderEducation,
} from "@/app/admin/actions/education";

export default async function EducationPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const entries = await prisma.education.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <StatusBanner status={status} />
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Education.
      </h1>

      <div className="mt-6 flex flex-col gap-4">
        {entries.map((e, i) => (
          <div key={e.id} id={`education-${e.id}`} className={`${card} flex scroll-mt-8 gap-4`}>
            <form action={updateEducation} className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={e.id} />
              <Field name="school" id={`school-${e.id}`} labelText="School" defaultValue={e.school} />
              <Field name="location" id={`location-${e.id}`} labelText="Location" defaultValue={e.location} />
              <Field name="degree" id={`degree-${e.id}`} labelText="Degree" defaultValue={e.degree} />
              <Field name="period" id={`period-${e.id}`} labelText="Period" defaultValue={e.period} />
              <div className="sm:col-span-2"><button type="submit" className={buttonPrimary}>Save</button></div>
            </form>
            <form action={deleteEducation}>
              <input type="hidden" name="id" value={e.id} />
              <ConfirmSubmitButton confirmText="Delete this entry?" className={buttonDanger}>
                Delete
              </ConfirmSubmitButton>
            </form>
            <ReorderButtons
              id={e.id}
              disableUp={i === 0}
              disableDown={i === entries.length - 1}
              reorder={reorderEducation}
            />
          </div>
        ))}
      </div>

      <form action={createEducation} className={`${card} mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2`}>
        <Field name="school" labelText="School" defaultValue="" />
        <Field name="location" labelText="Location" defaultValue="" />
        <Field name="degree" labelText="Degree" defaultValue="" />
        <Field name="period" labelText="Period" defaultValue="" />
        <div className="sm:col-span-2"><button type="submit" className={buttonPrimary}>Add education entry</button></div>
      </form>
    </div>
  );
}

function Field({
  name,
  id,
  labelText,
  defaultValue,
}: {
  name: string;
  id?: string;
  labelText: string;
  defaultValue: string;
}) {
  const fieldId = id ?? name;
  return (
    <div className="flex flex-col gap-1.5">
      <label className={label} htmlFor={fieldId}>{labelText}</label>
      <input id={fieldId} name={name} defaultValue={defaultValue} className={input} required />
    </div>
  );
}
