import { readDB } from "@/lib/store";
import OrdersAdmin from "@/components/admin/OrdersAdmin";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const db = await readDB();
  const orders = db.leads.filter((lead) => lead.type === "order");
  return <OrdersAdmin initial={orders} />;
}
