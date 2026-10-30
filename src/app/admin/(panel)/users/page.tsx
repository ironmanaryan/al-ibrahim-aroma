import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { readDB } from "@/lib/store";
import UsersAdmin from "@/components/admin/UsersAdmin";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin");
  const db = await readDB();
  const users = db.users.map(({ passwordHash: _passwordHash, ...rest }) => rest);
  return <UsersAdmin initial={users} currentUserId={session.id} />;
}
