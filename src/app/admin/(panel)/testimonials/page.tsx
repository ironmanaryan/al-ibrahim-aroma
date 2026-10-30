import { readDB } from "@/lib/store";
import TestimonialsAdmin from "@/components/admin/TestimonialsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const db = await readDB();
  return <TestimonialsAdmin initial={db.testimonials} />;
}
