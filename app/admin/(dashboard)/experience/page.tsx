import { prisma } from "@/lib/prisma";
import { input, textarea, label, card, buttonPrimary, buttonGhost, buttonDanger } from "@/lib/admin-ui";
import StatusBanner from "@/components/admin/StatusBanner";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import ReorderButtons from "@/components/admin/ReorderButtons";
import {
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperience,
  createExperienceBullet,
  updateExperienceBullet,
  deleteExperienceBullet,
  reorderExperienceBullet,
} from "@/app/admin/actions/experience";

export default async function ExperiencePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
    include: { bullets: { orderBy: { order: "asc" } } },
  });

  return (
    <div>
      <StatusBanner status={status} />
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Experience.
      </h1>

      <div className="mt-6 flex flex-col gap-6">
        {experiences.map((e, i) => (
          <div key={e.id} className={`${card} flex gap-4`}>
            <div className="min-w-0 flex-1">
              <form action={updateExperience} className="flex flex-col gap-3">
                <input type="hidden" name="id" value={e.id} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <TextField name="role" id={`role-${e.id}`} labelText="Role" defaultValue={e.role} />
                  <TextField name="company" id={`company-${e.id}`} labelText="Company" defaultValue={e.company} />
                  <TextField name="period" id={`period-${e.id}`} labelText="Period" defaultValue={e.period} />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="submit" className={buttonPrimary}>Save</button>
                </div>
              </form>

              <div className="mt-5 flex flex-col gap-3">
                {e.bullets.map((b, bi) => (
                  <div key={b.id} className="flex items-start gap-3">
                    <form action={updateExperienceBullet} className="flex min-w-0 flex-1 flex-col gap-2">
                      <input type="hidden" name="id" value={b.id} />
                      <textarea name="text" defaultValue={b.text} className={textarea} required />
                      <div><button type="submit" className={buttonGhost}>Save</button></div>
                    </form>
                    <form action={deleteExperienceBullet}>
                      <input type="hidden" name="id" value={b.id} />
                      <ConfirmSubmitButton confirmText="Delete this bullet?" className={buttonDanger}>
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                    <ReorderButtons
                      id={b.id}
                      disableUp={bi === 0}
                      disableDown={bi === e.bullets.length - 1}
                      reorder={reorderExperienceBullet}
                    />
                  </div>
                ))}
                <form action={createExperienceBullet} className="flex flex-col gap-2">
                  <input type="hidden" name="id" value={e.id} />
                  <textarea name="text" placeholder="New bullet point" className={textarea} required />
                  <div><button type="submit" className={buttonGhost}>Add bullet</button></div>
                </form>
              </div>

              <form action={deleteExperience} className="mt-5">
                <input type="hidden" name="id" value={e.id} />
                <ConfirmSubmitButton confirmText="Delete this entire experience entry?" className={buttonDanger}>
                  Delete experience
                </ConfirmSubmitButton>
              </form>
            </div>
            <ReorderButtons
              id={e.id}
              disableUp={i === 0}
              disableDown={i === experiences.length - 1}
              reorder={reorderExperience}
            />
          </div>
        ))}
      </div>

      <form action={createExperience} className={`${card} mt-6 flex flex-col gap-3`}>
        <h2 className="font-display text-xl font-extrabold">Add an experience entry</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <TextField name="role" labelText="Role" defaultValue="" />
          <TextField name="company" labelText="Company" defaultValue="" />
          <TextField name="period" labelText="Period" defaultValue="" />
        </div>
        <button type="submit" className={`${buttonPrimary} self-start`}>Add experience</button>
      </form>
    </div>
  );
}

function TextField({
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
