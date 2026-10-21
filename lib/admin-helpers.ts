import { prisma } from "@/lib/prisma";

type OrderedModel =
  | "aboutParagraph"
  | "experience"
  | "experienceBullet"
  | "project"
  | "projectBullet"
  | "projectLink"
  | "skillGroup"
  | "skillItem"
  | "cpStat"
  | "achievement"
  | "achievementAttachment"
  | "workshop"
  | "leadership"
  | "education";

type Row = { id: number; order: number } & Record<string, unknown>;

type Delegate = {
  findUnique: (args: unknown) => Promise<Row | null>;
  findMany: (args: unknown) => Promise<Row[]>;
  update: (args: unknown) => Promise<unknown>;
  delete: (args: unknown) => Promise<unknown>;
};

function delegateFor(model: OrderedModel): Delegate {
  return (prisma as unknown as Record<OrderedModel, Delegate>)[model];
}

/** Swaps `order` with the adjacent sibling in the given direction. When
 * `scopeField` is given, siblings are scoped to the current row's value for
 * that field (e.g. bullets reorder only within their own project/experience). */
export async function reorderEntity(
  model: OrderedModel,
  id: number,
  direction: "up" | "down",
  scopeField?: string
) {
  const delegate = delegateFor(model);
  const current = await delegate.findUnique({ where: { id } });
  if (!current) return;

  const siblings = await delegate.findMany({
    where: scopeField ? { [scopeField]: current[scopeField] } : {},
    orderBy: { order: "asc" },
  });
  const index = siblings.findIndex((s) => s.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= siblings.length) return;

  const other = siblings[swapIndex];
  await delegate.update({ where: { id: current.id }, data: { order: other.order } });
  await delegate.update({ where: { id: other.id }, data: { order: current.order } });
}

export async function deleteEntity(model: OrderedModel, id: number) {
  await delegateFor(model).delete({ where: { id } });
}

export function nextOrder(count: number) {
  return count;
}

export function requireString(formData: FormData, field: string): string {
  const value = formData.get(field);
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${field} is required`);
  }
  return value.trim();
}

export function optionalString(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

export function requireId(formData: FormData): number {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Missing id");
  return id;
}
