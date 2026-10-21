import { prisma } from "@/lib/prisma";
import { input, label, card, buttonPrimary, buttonGhost, buttonDanger } from "@/lib/admin-ui";
import StatusBanner from "@/components/admin/StatusBanner";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import ReorderButtons from "@/components/admin/ReorderButtons";
import MultiImageUploadField from "@/components/admin/MultiImageUploadField";
import {
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  reorderWorkshop,
  createWorkshopAttachment,
  deleteWorkshopAttachment,
  reorderWorkshopAttachment,
} from "@/app/admin/actions/workshops";

export default async function WorkshopsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const workshops = await prisma.workshop.findMany({
    orderBy: { order: "asc" },
    include: { attachments: { orderBy: { order: "asc" } } },
  });

  return (
    <div>
      <StatusBanner status={status} />
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Workshops.
      </h1>

      <div className="mt-6 flex flex-col gap-4">
        {workshops.map((w, i) => (
          <div key={w.id} id={`workshop-${w.id}`} className={`${card} flex scroll-mt-8 flex-col gap-4 sm:flex-row`}>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <form action={updateWorkshop} className="flex flex-col gap-3">
                <input type="hidden" name="id" value={w.id} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Field name="title" id={`title-${w.id}`} labelText="Title" defaultValue={w.title} />
                  <Field name="organizer" id={`organizer-${w.id}`} labelText="Organizer" defaultValue={w.organizer} />
                  <Field name="period" id={`period-${w.id}`} labelText="Period" defaultValue={w.period} />
                </div>
                <div><button type="submit" className={buttonPrimary}>Save</button></div>
              </form>

              <div>
                <h3 className="font-mono text-xs text-ink/70">Attachments</h3>
                <div className="mt-2 flex flex-col gap-2">
                  {w.attachments.map((att, ai) => (
                    <div key={att.id} className="flex items-center gap-3 rounded-lg border border-black/10 p-2.5">
                      {att.type === "IMAGE" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={att.url} alt="" className="h-10 w-10 flex-none rounded object-cover" />
                      ) : (
                        <span className="flex h-10 w-10 flex-none items-center justify-center rounded bg-paper-dim font-mono text-[0.65rem] text-ink/60">
                          {att.type}
                        </span>
                      )}
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-0 flex-1 truncate text-sm font-semibold text-ink underline-offset-4 hover:text-accent hover:underline"
                      >
                        {att.label || att.url}
                      </a>
                      <form action={deleteWorkshopAttachment}>
                        <input type="hidden" name="id" value={att.id} />
                        <input type="hidden" name="workshopId" value={w.id} />
                        <ConfirmSubmitButton confirmText="Remove this attachment?" className={buttonDanger}>
                          Remove
                        </ConfirmSubmitButton>
                      </form>
                      <ReorderButtons
                        id={att.id}
                        disableUp={ai === 0}
                        disableDown={ai === w.attachments.length - 1}
                        reorder={reorderWorkshopAttachment}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex flex-col gap-3 rounded-lg border border-dashed border-black/15 p-3 sm:flex-row sm:items-end">
                  <form action={createWorkshopAttachment} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-end">
                    <input type="hidden" name="id" value={w.id} />
                    <div className="flex flex-col gap-1.5">
                      <label className={label}>Type</label>
                      <select name="type" className={input} defaultValue="LINK">
                        <option value="LINK">Link</option>
                        <option value="VIDEO">Video</option>
                      </select>
                    </div>
                    <input name="label" placeholder="Label (e.g. Certificate)" className={input} />
                    <input name="url" placeholder="https://…" className={input} required />
                    <button type="submit" className={buttonGhost}>Add</button>
                  </form>
                </div>
                <AttachImageForm workshopId={w.id} />
              </div>
            </div>

            <div className="flex flex-row gap-3 sm:flex-col">
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

function AttachImageForm({ workshopId }: { workshopId: number }) {
  return (
    <form action={createWorkshopAttachment} className="mt-3 flex flex-col gap-2 rounded-lg border border-dashed border-black/15 p-3 sm:flex-row sm:items-end">
      <input type="hidden" name="id" value={workshopId} />
      <input type="hidden" name="type" value="IMAGE" />
      <MultiImageUploadField name="url" label="Attach images" />
      <input name="label" placeholder="Label (optional, applies to all)" className={input} />
      <button type="submit" className={buttonGhost}>Add</button>
    </form>
  );
}
