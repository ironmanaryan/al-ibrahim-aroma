import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/content";
import LeadForm from "@/components/LeadForm";
import { Clock, Mail, MapPin, Phone, Whatsapp } from "@/components/icons";
import { whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact & bulk orders",
  description:
    "Write to Al Ibrahim Aroma about a fragrance, a gift, a wedding or a bulk order. We reply within one working day — or message us on WhatsApp.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string }>;
}) {
  const [settings, params] = await Promise.all([getSettings(), searchParams]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Contact</span>
          </div>
          <span className="eyebrow">A person, not a form</span>
          <h1 className="page-hero__title">
            Tell us what you are <em className="serif-italic">looking for</em>
          </h1>
          <p className="lede" style={{ marginTop: 20 }}>
            Three short steps, then a real reply from the atelier — usually within a working day. For
            weddings and bulk orders, mention the date and quantity and we will send a costing.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="contact-grid">
            <div style={{ display: "grid", gap: 14 }}>
              <div className="contact-card">
                <span className="eyebrow">The atelier</span>
                <div className="contact-card__row">
                  <MapPin size={17} />
                  <div>
                    <strong>Visit</strong>
                    {settings.address}
                  </div>
                </div>
                <div className="contact-card__row">
                  <Phone size={17} />
                  <div>
                    <strong>Call</strong>
                    <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>
                  </div>
                </div>
                <div className="contact-card__row">
                  <Mail size={17} />
                  <div>
                    <strong>Write</strong>
                    <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  </div>
                </div>
                <div className="contact-card__row">
                  <Clock size={17} />
                  <div>
                    <strong>Hours</strong>
                    {settings.hours}
                  </div>
                </div>
                <a
                  className="btn btn--gold btn--block"
                  href={whatsappUrl(
                    settings.whatsapp,
                    "Hello Al Ibrahim Aroma, I would like some help choosing a fragrance.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Whatsapp size={15} /> Chat on WhatsApp
                </a>
              </div>

              <div className="contact-note">
                <span className="overline">Bulk &amp; weddings</span>
                <p>
                  Fifty coffrets or more, custom blends, corporate gifting and press requests are handled
                  separately. Choose “Bulk or wedding order” in the form and we will send a costing and a
                  sample box within two days.
                </p>
              </div>
            </div>

            <div className="form-shell">
              <LeadForm settings={settings} defaultInterest={params.interest} />
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="map-card">
            <div className="map-card__map" aria-hidden="true">
              <span className="map-card__pin" />
              <span className="map-card__ring" />
            </div>
            <div className="map-card__info">
              <span className="eyebrow">Find us</span>
              <h3 className="h3">14 Hazratganj, Lucknow</h3>
              <p className="muted" style={{ fontSize: 13, lineHeight: 1.7 }}>
                Between the old book stalls and the chai corner, a green door and a brass bell. We are on
                the first floor — ring twice if the shop is quiet.
              </p>
              <a
                className="link-underline"
                href="https://maps.google.com/?q=Hazratganj+Lucknow"
                target="_blank"
                rel="noreferrer"
              >
                Open in maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
