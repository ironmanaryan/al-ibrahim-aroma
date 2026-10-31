import { getCollections, getProducts, getSettings } from "@/lib/content";
import { CartProvider } from "@/components/CartProvider";
import { ToastProvider } from "@/components/Toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFab from "@/components/WhatsAppFab";
import MotionProvider from "@/components/MotionProvider";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Analytics from "@/components/Analytics";

export const revalidate = 300;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, collections, products] = await Promise.all([
    getSettings(),
    getCollections(),
    getProducts(),
  ]);

  const searchable = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    family: p.family,
    price: p.price,
    art: p.art,
  }));

  return (
    <CartProvider>
      <ToastProvider>
        <Preloader />
        <AnnouncementBar items={settings.announcement} />
        <Header settings={settings} collections={collections} products={searchable} />
        <main>{children}</main>
        <Footer settings={settings} collections={collections} />
        <WhatsAppFab settings={settings} />
        <CartDrawer settings={settings} />
        <MotionProvider />
        <SmoothScroll />
        <Analytics />
      </ToastProvider>
    </CartProvider>
  );
}
