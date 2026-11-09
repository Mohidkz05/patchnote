import { Suspense } from "react";
import { connection } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { addNote } from "./actions";

const field =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700";

export default function NotesPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-zinc-900">Release notes</h1>

      <form action={addNote} className="mt-8 flex flex-col gap-4 rounded-lg border border-zinc-200 p-6">
        <div className="flex gap-4">
          <label className="flex w-32 flex-col gap-1 text-sm font-medium text-zinc-700">
            Version
            <input name="version" required maxLength={20} placeholder="v1.2.0" className={field} />
          </label>
          <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-zinc-700">
            Title
            <input name="title" required maxLength={120} placeholder="Dark mode is here" className={field} />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          What changed
          <textarea name="description" required maxLength={2000} rows={3} className={field} />
        </label>
        <button
          type="submit"
          className="min-h-11 self-start rounded-md bg-emerald-800 px-5 font-medium text-white hover:bg-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
        >
          Add note
        </button>
      </form>

      <Suspense fallback={<p className="mt-8 text-zinc-600">Loading notes…</p>}>
        <NotesList />
      </Suspense>
    </main>
  );
}

async function NotesList() {
  await connection(); // read fresh from the database on every request
  const rows = await db.select().from(notes).orderBy(desc(notes.createdAt));

  if (rows.length === 0) {
    return <p className="mt-8 text-zinc-600">No notes yet. Add your first one above.</p>;
  }

  return (
    <ul className="mt-8 flex flex-col gap-4">
      {rows.map((n) => (
        <li key={n.id} className="rounded-lg border border-zinc-200 p-5">
          <p className="text-sm text-zinc-600">
            {n.version} · {n.createdAt.toISOString().slice(0, 10)}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-zinc-900">{n.title}</h2>
          <p className="mt-2 whitespace-pre-line text-zinc-700">{n.description}</p>
        </li>
      ))}
    </ul>
  );
}
