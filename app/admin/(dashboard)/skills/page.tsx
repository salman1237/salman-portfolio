import { prisma } from "@/lib/prisma";
import { input, label, card, buttonPrimary, buttonGhost, buttonDanger } from "@/lib/admin-ui";
import StatusBanner from "@/components/admin/StatusBanner";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import ReorderButtons from "@/components/admin/ReorderButtons";
import {
  createSkillGroup,
  updateSkillGroup,
  deleteSkillGroup,
  reorderSkillGroup,
  createSkillItem,
  updateSkillItem,
  deleteSkillItem,
  reorderSkillItem,
} from "@/app/admin/actions/skills";

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const groups = await prisma.skillGroup.findMany({
    orderBy: { order: "asc" },
    include: { items: { orderBy: { order: "asc" } } },
  });

  return (
    <div>
      <StatusBanner status={status} />
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Skills.
      </h1>

      <div className="mt-6 flex flex-col gap-6">
        {groups.map((g, i) => (
          <div key={g.id} id={`group-${g.id}`} className={`${card} flex scroll-mt-8 gap-4`}>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-end gap-3">
                <form action={updateSkillGroup} className="flex flex-wrap items-end gap-3">
                  <input type="hidden" name="id" value={g.id} />
                  <div className="flex flex-col gap-1.5">
                    <label className={label} htmlFor={`cat-${g.id}`}>Category</label>
                    <input id={`cat-${g.id}`} name="category" defaultValue={g.category} className={input} required />
                  </div>
                  <button type="submit" className={buttonPrimary}>Save</button>
                </form>
                <form action={deleteSkillGroup}>
                  <input type="hidden" name="id" value={g.id} />
                  <ConfirmSubmitButton confirmText="Delete this whole group and its tags?" className={buttonDanger}>
                    Delete group
                  </ConfirmSubmitButton>
                </form>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {g.items.map((item, ii) => (
                  <div key={item.id} id={`item-${item.id}`} className="flex scroll-mt-8 items-center gap-3">
                    <form action={updateSkillItem} className="flex min-w-0 flex-1 items-center gap-2">
                      <input type="hidden" name="id" value={item.id} />
                      <input name="name" defaultValue={item.name} className={input} required />
                      <button type="submit" className={buttonGhost}>Save</button>
                    </form>
                    <form action={deleteSkillItem}>
                      <input type="hidden" name="id" value={item.id} />
                      <ConfirmSubmitButton confirmText="Delete this tag?" className={buttonDanger}>
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                    <ReorderButtons
                      id={item.id}
                      disableUp={ii === 0}
                      disableDown={ii === g.items.length - 1}
                      reorder={reorderSkillItem}
                    />
                  </div>
                ))}
                <form action={createSkillItem} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={g.id} />
                  <input name="name" placeholder="New tag" className={input} required />
                  <button type="submit" className={buttonGhost}>Add tag</button>
                </form>
              </div>
            </div>
            <ReorderButtons
              id={g.id}
              disableUp={i === 0}
              disableDown={i === groups.length - 1}
              reorder={reorderSkillGroup}
            />
          </div>
        ))}
      </div>

      <form action={createSkillGroup} className={`${card} mt-6 flex flex-wrap items-end gap-3`}>
        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="new-category">New category</label>
          <input id="new-category" name="category" className={input} required />
        </div>
        <button type="submit" className={buttonPrimary}>Add group</button>
      </form>
    </div>
  );
}
