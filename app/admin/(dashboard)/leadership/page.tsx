import { prisma } from "@/lib/prisma";
import { input, textarea, label, card, buttonPrimary, buttonDanger } from "@/lib/admin-ui";
import StatusBanner from "@/components/admin/StatusBanner";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import ReorderButtons from "@/components/admin/ReorderButtons";
import {
  createLeadership,
  updateLeadership,
  deleteLeadership,
  reorderLeadership,
} from "@/app/admin/actions/leadership";

export default async function LeadershipPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const entries = await prisma.leadership.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <StatusBanner status={status} />
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Leadership.
      </h1>

      <div className="mt-6 flex flex-col gap-4">
        {entries.map((l, i) => (
          <div key={l.id} id={`leadership-${l.id}`} className={`${card} flex scroll-mt-8 gap-4`}>
            <form action={updateLeadership} className="flex min-w-0 flex-1 flex-col gap-3">
              <input type="hidden" name="id" value={l.id} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field name="role" id={`role-${l.id}`} labelText="Role" defaultValue={l.role} />
                <Field name="place" id={`place-${l.id}`} labelText="Place" defaultValue={l.place} />
                <Field name="period" id={`period-${l.id}`} labelText="Period" defaultValue={l.period} />
              </div>
              <textarea name="text" defaultValue={l.text} className={textarea} required />
              <div><button type="submit" className={buttonPrimary}>Save</button></div>
            </form>
            <form action={deleteLeadership}>
              <input type="hidden" name="id" value={l.id} />
              <ConfirmSubmitButton confirmText="Delete this entry?" className={buttonDanger}>
                Delete
              </ConfirmSubmitButton>
            </form>
            <ReorderButtons
              id={l.id}
              disableUp={i === 0}
              disableDown={i === entries.length - 1}
              reorder={reorderLeadership}
            />
          </div>
        ))}
      </div>

      <form action={createLeadership} className={`${card} mt-4 flex flex-col gap-3`}>
        <h2 className="font-display text-xl font-extrabold">Add a leadership entry</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field name="role" labelText="Role" defaultValue="" />
          <Field name="place" labelText="Place" defaultValue="" />
          <Field name="period" labelText="Period" defaultValue="" />
        </div>
        <textarea name="text" placeholder="Description" className={textarea} required />
        <button type="submit" className={`${buttonPrimary} self-start`}>Add leadership entry</button>
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
