import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/content";
import { whatsappUrl } from "@/lib/utils";
import TrackClient from "@/components/TrackClient";
import { ArrowRight, Clock, MapPin, Whatsapp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Track order",
  description:
    "Follow your parcel from the Lucknow atelier to your door — order status, courier and expected delivery.",
  alternates: { canonical: "/track" },
};

export default async function TrackPage() {
  const settings = await getSettings();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Track order</span>
          </div>
          <span className="eyebrow">From the atelier to your door</span>
          <h1 className="page-hero__title">
            Follow the <em className="serif-italic">parcel</em>
          </h1>
          <p className="lede" style={{ marginTop: 20 }}>
            Every order is blended, wrapped and stamped by hand before it leaves Lucknow. Enter the number
            from your confirmation to see exactly where it is.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="container">
          <div className="track-layout">
            <TrackClient whatsapp={settings.whatsapp} />

            <aside className="track-aside">
              <div className="track-note">
                <span className="track-note__icon">
                  <MapPin size={16} />
                </span>
                <div>
                  <h3>Dispatched from Lucknow</h3>
                  <p>
                    Everything leaves 14 Hazratganj within 24 hours of confirmation, Monday to Saturday.
                    Tracking is shared on WhatsApp the moment the parcel is scanned.
                  </p>
                </div>
              </div>
              <div className="track-note">
                <span className="track-note__icon">
                  <Clock size={16} />
                </span>
                <div>
                  <h3>Not moving?</h3>
                  <p>
                    A parcel can sit still for a day over a weekend. If nothing has changed in 48 hours,
                    write to us and a person will chase it — not a bot.
                  </p>
                </div>
              </div>
              <div className="track-note track-note--gold">
                <h3>Need a person?</h3>
                <p>The WhatsApp line is answered by the atelier, usually within the hour.</p>
                <a
                  className="link-underline"
                  href={whatsappUrl(
                    settings.whatsapp,
                    "Hello Al Ibrahim Aroma, I would like help tracking my order.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Whatsapp size={13} /> Start a conversation
                </a>
              </div>
              <Link href="/contact" className="link-underline">
                Write a longer note <ArrowRight size={13} />
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
