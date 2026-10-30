import { readDB } from "@/lib/store";
import LeadsAdmin from "@/components/admin/LeadsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const db = await readDB();
  return <LeadsAdmin initial={db.leads} />;
}
