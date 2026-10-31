"use client";

import { useState } from "react";
import { whatsappUrl } from "@/lib/utils";
import { ArrowRight, Check, Clock, Truck, Whatsapp } from "./icons";

type Step = {
  title: string;
  meta: string;
  copy: string;
  state: "done" | "current" | "todo";
};

const STEPS: Step[] = [
  {
    title: "Order placed",
    meta: "22 Oct · 4:12 pm",
    copy: "We received your order and reserved your batch from the current distillation.",
    state: "done",
  },
  {
    title: "Blended, sealed & wrapped",
    meta: "23 Oct · 11:40 am",
    copy: "Hand-filled, wrapped in khadi and sealed with wax by the atelier.",
    state: "done",
  },
  {
    title: "In transit",
    meta: "24 Oct · 7:05 am",
    copy: "Lucknow → New Delhi. Blue Dart · AWB 4182 9930 114.",
    state: "current",
  },
  {
    title: "Out for delivery",
    meta: "Expected 27 Oct",
    copy: "Your parcel will arrive between 10 am and 7 pm. A call comes first.",
    state: "todo",
  },
];

export default function TrackClient({ whatsapp }: { whatsapp: string }) {
  const [order, setOrder] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (order.trim().length < 4) {
      setError("Enter the order number from your WhatsApp confirmation.");
      setStatus("error");
      return;
    }
    if (contact.trim().length < 4) {
      setError("Enter the phone number or email used on the order.");
      setStatus("error");
      return;
    }
    setError("");
    setStatus("loading");
    window.setTimeout(() => setStatus("done"), 650);
  }

  return (
    <div className="track">
      <form className="track-form" onSubmit={submit} noValidate>
        <div className="track-form__grid">
          <label className="track-field">
            <span>Order number</span>
            <input
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="AIA-2419"
              autoComplete="off"
            />
          </label>
          <label className="track-field">
            <span>Phone or email</span>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="The one you ordered with"
              autoComplete="email"
            />
          </label>
        </div>
        {error ? <p className="track-error">{error}</p> : null}
        <button className="btn btn--gold" disabled={status === "loading"}>
          {status === "loading" ? "Looking it up…" : "Track my parcel"}
          <ArrowRight size={14} />
        </button>
        <p className="track-hint">
          The order number is in the WhatsApp message we sent when your parcel was confirmed.
        </p>
      </form>

      {status === "done" ? (
        <article className="track-card">
          <div className="track-card__head">
            <div>
              <span className="overline">Order</span>
              <strong className="track-card__id">#{order.trim().toUpperCase()}</strong>
              <span className="track-card__sub">Placed 22 Oct 2026 · 2 compositions · ₹7,290</span>
            </div>
            <span className="track-status">
              <Truck size={13} /> In transit
            </span>
          </div>

          <ol className="track-timeline">
            {STEPS.map((step) => (
              <li key={step.title} data-state={step.state}>
                <span className="track-step__dot">
                  {step.state === "done" ? (
                    <Check size={12} />
                  ) : step.state === "current" ? (
                    <Truck size={12} />
                  ) : (
                    <span />
                  )}
                </span>
                <div className="track-step__body">
                  <span className="track-step__meta">{step.meta}</span>
                  <strong>{step.title}</strong>
                  <p>{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="track-card__foot">
            <span>
              <Clock size={14} /> Expected delivery · 27 Oct 2026
            </span>
            <a
              className="btn btn--line btn--sm"
              href={whatsappUrl(whatsapp, `Hello Al Ibrahim Aroma, I would like an update on order #${order.trim().toUpperCase()}.`)}
              target="_blank"
              rel="noreferrer"
            >
              <Whatsapp size={13} /> Ask about this order
            </a>
          </div>
        </article>
      ) : null}
    </div>
  );
}

