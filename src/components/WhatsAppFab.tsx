import type { Settings } from "@/lib/types";
import { Whatsapp } from "./icons";

export default function WhatsAppFab({ settings }: { settings: Settings }) {
  const number = settings.whatsapp.replace(/[^0-9]/g, "");
  const text = encodeURIComponent(
    "Hello Al Ibrahim Aroma, I found you online and would like some help choosing a fragrance.",
  );
  return (
    <a
      className="wa-fab"
      href={`https://wa.me/${number}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Al Ibrahim Aroma on WhatsApp"
      title="Chat on WhatsApp"
    >
      <Whatsapp size={27} />
    </a>
  );
}
