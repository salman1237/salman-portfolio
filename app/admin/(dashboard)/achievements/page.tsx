import { prisma } from "@/lib/prisma";
import { textarea, label, card, buttonPrimary, buttonDanger } from "@/lib/admin-ui";
import StatusBanner from "@/components/admin/StatusBanner";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import ReorderButtons from "@/components/admin/ReorderButtons";
import {
  createAchievement,
  updateAchievement,
  deleteAchievement,
  reorderAchievement,
} from "@/app/admin/actions/achievements";

export default async function AchievementsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const achievements = await prisma.achievement.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <StatusBanner status={status} />
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Achievements.
      </h1>

      <div className="mt-6 flex flex-col gap-4">
        {achievements.map((a, i) => (
          <div key={a.id} id={`achievement-${a.id}`} className={`${card} flex scroll-mt-8 gap-4`}>
            <form action={updateAchievement} className="flex min-w-0 flex-1 flex-col gap-3">
              <input type="hidden" name="id" value={a.id} />
              <textarea name="text" defaultValue={a.text} className={textarea} required />
              <div><button type="submit" className={buttonPrimary}>Save</button></div>
            </form>
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
