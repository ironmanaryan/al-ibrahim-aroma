import { readDB } from "@/lib/store";
import ActivityAdmin from "@/components/admin/ActivityAdmin";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  const db = await readDB();
  return <ActivityAdmin initial={db.activity} />;
}
