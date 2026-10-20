import { prisma } from "@/lib/prisma";
import { input, textarea, label, card, buttonPrimary, buttonGhost, buttonDanger } from "@/lib/admin-ui";
import StatusBanner from "@/components/admin/StatusBanner";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import ReorderButtons from "@/components/admin/ReorderButtons";
import ImageUploadField from "@/components/admin/ImageUploadField";
import {
  createProject,
  updateProject,
  deleteProject,
  reorderProject,
  createProjectBullet,
  updateProjectBullet,
  deleteProjectBullet,
  reorderProjectBullet,
  createProjectLink,
  updateProjectLink,
  deleteProjectLink,
  reorderProjectLink,
} from "@/app/admin/actions/projects";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; message?: string }>;
}) {
  const { status, message } = await searchParams;
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    include: {
      bullets: { orderBy: { order: "asc" } },
      links: { orderBy: { order: "asc" } },
    },
  });

  return (
    <div>
      <StatusBanner status={status} message={message} />
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        Projects.
      </h1>

      <div className="mt-6 flex flex-col gap-6">
        {projects.map((p, i) => (
          <div key={p.id} className={`${card} flex gap-4`}>
            <div className="min-w-0 flex-1">
              <form
                action={updateProject}
                encType="multipart/form-data"
                className="flex flex-col gap-3"
              >
                <input type="hidden" name="id" value={p.id} />
                <ImageUploadField
                  name="coverImage"
                  removeFieldName="removeCoverImage"
                  label="Cover image"
                  currentUrl={p.coverImageUrl}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <TextField name="name" id={`name-${p.id}`} labelText="Name" defaultValue={p.name} />
                  <TextField name="stack" id={`stack-${p.id}`} labelText="Stack" defaultValue={p.stack} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={label} htmlFor={`tagline-${p.id}`}>Tagline</label>
                  <input
                    id={`tagline-${p.id}`}
                    name="tagline"
                    defaultValue={p.tagline}
                    className={input}
                    required
                  />
                </div>
                <label className="flex min-h-[44px] items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" name="dark" defaultChecked={p.dark} className="h-5 w-5" />
                  Show with a dark background
                </label>
                <div>
                  <button type="submit" className={buttonPrimary}>Save</button>
                </div>
              </form>

              <h3 className="mt-5 font-mono text-xs text-ink/70">Bullets</h3>
              <div className="mt-2 flex flex-col gap-3">
                {p.bullets.map((b, bi) => (
                  <div key={b.id} className="flex items-start gap-3">
                    <form action={updateProjectBullet} className="flex min-w-0 flex-1 flex-col gap-2">
                      <input type="hidden" name="id" value={b.id} />
                      <textarea name="text" defaultValue={b.text} className={textarea} required />
                      <div><button type="submit" className={buttonGhost}>Save</button></div>
                    </form>
                    <form action={deleteProjectBullet}>
                      <input type="hidden" name="id" value={b.id} />
                      <ConfirmSubmitButton confirmText="Delete this bullet?" className={buttonDanger}>
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                    <ReorderButtons
                      id={b.id}
                      disableUp={bi === 0}
                      disableDown={bi === p.bullets.length - 1}
                      reorder={reorderProjectBullet}
                    />
                  </div>
                ))}
                <form action={createProjectBullet} className="flex flex-col gap-2">
                  <input type="hidden" name="id" value={p.id} />
                  <textarea name="text" placeholder="New bullet point" className={textarea} required />
                  <div><button type="submit" className={buttonGhost}>Add bullet</button></div>
                </form>
              </div>

              <h3 className="mt-5 font-mono text-xs text-ink/70">Links</h3>
              <div className="mt-2 flex flex-col gap-3">
                {p.links.map((l, li) => (
                  <div key={l.id} className="flex items-start gap-3">
                    <form action={updateProjectLink} className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
                      <input type="hidden" name="id" value={l.id} />
                      <input name="label" defaultValue={l.label} placeholder="Label" className={input} required />
                      <input name="href" defaultValue={l.href} placeholder="https://…" className={input} required />
                      <button type="submit" className={buttonGhost}>Save</button>
                    </form>
                    <form action={deleteProjectLink}>
                      <input type="hidden" name="id" value={l.id} />
                      <ConfirmSubmitButton confirmText="Delete this link?" className={buttonDanger}>
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                    <ReorderButtons
                      id={l.id}
                      disableUp={li === 0}
                      disableDown={li === p.links.length - 1}
                      reorder={reorderProjectLink}
                    />
                  </div>
                ))}
                <form action={createProjectLink} className="flex flex-col gap-2 sm:flex-row">
                  <input type="hidden" name="id" value={p.id} />
                  <input name="label" placeholder="Label (e.g. Live site)" className={input} required />
                  <input name="href" placeholder="https://…" className={input} required />
                  <button type="submit" className={buttonGhost}>Add link</button>
                </form>
              </div>

              <form action={deleteProject} className="mt-5">
                <input type="hidden" name="id" value={p.id} />
                <ConfirmSubmitButton confirmText="Delete this entire project?" className={buttonDanger}>
                  Delete project
                </ConfirmSubmitButton>
              </form>
            </div>
            <ReorderButtons
              id={p.id}
              disableUp={i === 0}
              disableDown={i === projects.length - 1}
              reorder={reorderProject}
            />
          </div>
        ))}
      </div>

      <form
        action={createProject}
        encType="multipart/form-data"
        className={`${card} mt-6 flex flex-col gap-3`}
      >
        <h2 className="font-display text-xl font-extrabold">Add a project</h2>
        <ImageUploadField
          name="coverImage"
          removeFieldName="removeCoverImage"
          label="Cover image"
          currentUrl={null}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextField name="name" labelText="Name" defaultValue="" />
          <TextField name="stack" labelText="Stack" defaultValue="" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="new-tagline">Tagline</label>
          <input id="new-tagline" name="tagline" className={input} required />
        </div>
        <label className="flex min-h-[44px] items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="dark" className="h-5 w-5" />
          Show with a dark background
        </label>
        <button type="submit" className={`${buttonPrimary} self-start`}>Add project</button>
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
