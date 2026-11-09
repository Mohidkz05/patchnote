"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { notes, projects, users } from "@/db/schema";

// No login yet (that's a later lesson), so every note goes into one demo project.
async function getDemoProjectId() {
  await db
    .insert(users)
    .values({ email: "demo@patchnote.dev", name: "Demo" })
    .onConflictDoNothing();
  const [user] = await db.select().from(users).where(eq(users.email, "demo@patchnote.dev"));

  const [existing] = await db.select().from(projects).where(eq(projects.userId, user.id));
  if (existing) return existing.id;

  const [created] = await db
    .insert(projects)
    .values({ userId: user.id, name: "Demo project" })
    .returning();
  return created.id;
}

export async function addNote(formData: FormData) {
  const version = String(formData.get("version") ?? "").trim().slice(0, 20);
  const title = String(formData.get("title") ?? "").trim().slice(0, 120);
  const description = String(formData.get("description") ?? "").trim().slice(0, 2000);
  if (!version || !title || !description) return;

  const projectId = await getDemoProjectId();
  await db.insert(notes).values({ projectId, version, title, description });
  revalidatePath("/notes");
}
