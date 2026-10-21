import { prisma } from "@/lib/prisma";
import { input, label, card, buttonPrimary, buttonDanger } from "@/lib/admin-ui";
import StatusBanner from "@/components/admin/StatusBanner";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import ReorderButtons from "@/components/admin/ReorderButtons";
import { createCpStat, updateCpStat, deleteCpStat, reorderCpStat } from "@/app/admin/actions/cpstats";

export default async function CpStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const stats = await prisma.cpStat.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <StatusBanner status={status} />
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Competitive programming stats.
      </h1>

      <div className="mt-6 flex flex-col gap-4">
        {stats.map((s, i) => (
          <div key={s.id} id={`stat-${s.id}`} className={`${card} flex scroll-mt-8 gap-4`}>
            <form action={updateCpStat} className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-5 sm:items-end">
              <input type="hidden" name="id" value={s.id} />
              <Field name="platform" id={`platform-${s.id}`} labelText="Platform" defaultValue={s.platform} />
              <Field name="value" id={`value-${s.id}`} labelText="Rating" defaultValue={s.value} />
              <Field name="handle" id={`handle-${s.id}`} labelText="Handle" defaultValue={s.handle} />
              <Field name="url" id={`url-${s.id}`} labelText="Profile URL" defaultValue={s.url ?? ""} required={false} />
              <button type="submit" className={buttonPrimary}>Save</button>
            </form>
            <form action={deleteCpStat}>
              <input type="hidden" name="id" value={s.id} />
              <ConfirmSubmitButton confirmText="Delete this stat?" className={buttonDanger}>
                Delete
              </ConfirmSubmitButton>
            </form>
            <ReorderButtons
              id={s.id}
              disableUp={i === 0}
              disableDown={i === stats.length - 1}
              reorder={reorderCpStat}
            />
          </div>
        ))}
      </div>

      <form action={createCpStat} className={`${card} mt-4 grid grid-cols-1 gap-3 sm:grid-cols-5 sm:items-end`}>
        <Field name="platform" labelText="Platform" defaultValue="" />
        <Field name="value" labelText="Rating" defaultValue="" />
        <Field name="handle" labelText="Handle" defaultValue="" />
        <Field name="url" labelText="Profile URL" defaultValue="" required={false} />
        <button type="submit" className={buttonPrimary}>Add stat</button>
      </form>
    </div>
  );
}

function Field({
  name,
  id,
  labelText,
  defaultValue,
  required = true,
}: {
  name: string;
  id?: string;
  labelText: string;
  defaultValue: string;
  required?: boolean;
}) {
  const fieldId = id ?? name;
  return (
    <div className="flex flex-col gap-1.5">
      <label className={label} htmlFor={fieldId}>{labelText}</label>
      <input id={fieldId} name={name} defaultValue={defaultValue} className={input} required={required} />
    </div>
  );
}
