import { prisma } from "@/lib/prisma";
import { input, label, card, buttonPrimary, buttonDanger } from "@/lib/admin-ui";
import StatusBanner from "@/components/admin/StatusBanner";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import ReorderButtons from "@/components/admin/ReorderButtons";
import {
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  reorderWorkshop,
} from "@/app/admin/actions/workshops";

export default async function WorkshopsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const workshops = await prisma.workshop.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <StatusBanner status={status} />
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Workshops.
      </h1>

      <div className="mt-6 flex flex-col gap-4">
        {workshops.map((w, i) => (
          <div key={w.id} id={`workshop-${w.id}`} className={`${card} flex scroll-mt-8 gap-4`}>
            <form action={updateWorkshop} className="flex min-w-0 flex-1 flex-col gap-3">
              <input type="hidden" name="id" value={w.id} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field name="title" id={`title-${w.id}`} labelText="Title" defaultValue={w.title} />
                <Field name="organizer" id={`organizer-${w.id}`} labelText="Organizer" defaultValue={w.organizer} />
                <Field name="period" id={`period-${w.id}`} labelText="Period" defaultValue={w.period} />
              </div>
              <div><button type="submit" className={buttonPrimary}>Save</button></div>
            </form>
            <form action={deleteWorkshop}>
              <input type="hidden" name="id" value={w.id} />
              <ConfirmSubmitButton confirmText="Delete this workshop?" className={buttonDanger}>
                Delete
              </ConfirmSubmitButton>
            </form>
            <ReorderButtons
              id={w.id}
              disableUp={i === 0}
              disableDown={i === workshops.length - 1}
              reorder={reorderWorkshop}
            />
          </div>
        ))}
      </div>

      <form action={createWorkshop} className={`${card} mt-4 flex flex-col gap-3`}>
        <h2 className="font-display text-xl font-extrabold">Add a workshop</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field name="title" labelText="Title" defaultValue="" />
          <Field name="organizer" labelText="Organizer" defaultValue="" />
          <Field name="period" labelText="Period" defaultValue="" />
        </div>
        <button type="submit" className={`${buttonPrimary} self-start`}>Add workshop</button>
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
