import { prisma } from "@/lib/prisma";
import { input, textarea, label, card, buttonPrimary, buttonGhost, buttonDanger } from "@/lib/admin-ui";
import StatusBanner from "@/components/admin/StatusBanner";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import ReorderButtons from "@/components/admin/ReorderButtons";
import MultiImageUploadField from "@/components/admin/MultiImageUploadField";
import {
  createAchievement,
  updateAchievement,
  deleteAchievement,
  reorderAchievement,
  createAchievementAttachment,
  deleteAchievementAttachment,
  reorderAchievementAttachment,
} from "@/app/admin/actions/achievements";

export default async function AchievementsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const achievements = await prisma.achievement.findMany({
    orderBy: { order: "asc" },
    include: { attachments: { orderBy: { order: "asc" } } },
  });

  return (
    <div>
      <StatusBanner status={status} />
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Achievements.
      </h1>

      <div className="mt-6 flex flex-col gap-4">
        {achievements.map((a, i) => (
          <div key={a.id} id={`achievement-${a.id}`} className={`${card} flex scroll-mt-8 flex-col gap-4 sm:flex-row`}>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <form action={updateAchievement} className="flex flex-col gap-3">
                <input type="hidden" name="id" value={a.id} />
                <textarea name="text" defaultValue={a.text} className={textarea} required />
                <div><button type="submit" className={buttonPrimary}>Save</button></div>
              </form>

              <div>
                <h3 className="font-mono text-xs text-ink/70">Attachments</h3>
                <div className="mt-2 flex flex-col gap-2">
                  {a.attachments.map((att, ai) => (
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
                      <form action={deleteAchievementAttachment}>
                        <input type="hidden" name="id" value={att.id} />
                        <input type="hidden" name="achievementId" value={a.id} />
                        <ConfirmSubmitButton confirmText="Remove this attachment?" className={buttonDanger}>
                          Remove
                        </ConfirmSubmitButton>
                      </form>
                      <ReorderButtons
                        id={att.id}
                        disableUp={ai === 0}
                        disableDown={ai === a.attachments.length - 1}
                        reorder={reorderAchievementAttachment}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex flex-col gap-3 rounded-lg border border-dashed border-black/15 p-3 sm:flex-row sm:items-end">
                  <form action={createAchievementAttachment} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-end">
                    <input type="hidden" name="id" value={a.id} />
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
                <AttachImageForm achievementId={a.id} />
              </div>
            </div>

            <div className="flex flex-row gap-3 sm:flex-col">
              <form action={deleteAchievement}>
                <input type="hidden" name="id" value={a.id} />
                <ConfirmSubmitButton confirmText="Delete this achievement?" className={buttonDanger}>
                  Delete
                </ConfirmSubmitButton>
              </form>
              <ReorderButtons
                id={a.id}
                disableUp={i === 0}
                disableDown={i === achievements.length - 1}
                reorder={reorderAchievement}
              />
            </div>
          </div>
        ))}
      </div>

      <form action={createAchievement} className={`${card} mt-4 flex flex-col gap-3`}>
        <label className={label} htmlFor="new-achievement">Add an achievement</label>
        <textarea id="new-achievement" name="text" className={textarea} required />
        <button type="submit" className={`${buttonPrimary} self-start`}>Add achievement</button>
      </form>
    </div>
  );
}

function AttachImageForm({ achievementId }: { achievementId: number }) {
  return (
    <form action={createAchievementAttachment} className="mt-3 flex flex-col gap-2 rounded-lg border border-dashed border-black/15 p-3 sm:flex-row sm:items-end">
      <input type="hidden" name="id" value={achievementId} />
      <input type="hidden" name="type" value="IMAGE" />
      <MultiImageUploadField name="url" label="Attach images" />
      <input name="label" placeholder="Label (optional, applies to all)" className={input} />
      <button type="submit" className={buttonGhost}>Add</button>
    </form>
  );
}
