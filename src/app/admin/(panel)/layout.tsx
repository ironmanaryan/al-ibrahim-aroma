import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import { ToastProvider } from "@/components/Toast";
import "../admin.css";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/admin/login");

  return (
    <ToastProvider>
      <AdminShell user={user}>{children}</AdminShell>
    </ToastProvider>
  );
}
