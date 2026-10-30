import { readDB } from "@/lib/store";
import ProductsAdmin from "@/components/admin/ProductsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const db = await readDB();
  return <ProductsAdmin initial={db.products} />;
}
