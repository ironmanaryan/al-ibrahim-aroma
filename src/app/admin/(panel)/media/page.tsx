import { readDB } from "@/lib/store";
import MediaAdmin from "@/components/admin/MediaAdmin";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const db = await readDB();
  return <MediaAdmin initial={db.media} />;
}
