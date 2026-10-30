import { readDB } from "@/lib/store";
import JournalAdmin from "@/components/admin/JournalAdmin";

export const dynamic = "force-dynamic";

export default async function AdminJournalPage() {
  const db = await readDB();
  return <JournalAdmin initial={db.journal} />;
}
