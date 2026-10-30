import { readDB } from "@/lib/store";
import SettingsAdmin from "@/components/admin/SettingsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const db = await readDB();
  return <SettingsAdmin initial={db.settings} />;
}
