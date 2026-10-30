"use client";

import { useState } from "react";
import type { Settings } from "@/lib/types";
import { whatsappUrl } from "@/lib/utils";
import { ArrowRight, Check, Whatsapp } from "./icons";

type Interest = "personal" | "gifting" | "bulk" | "other";

const INTERESTS: { value: Interest; label: string; hint: string }[] = [
  { value: "personal", label: "A fragrance for myself", hint: "attars, parfums, discovery" },
  { value: "gifting", label: "A gift", hint: "coffrets, hand-written notes" },
  { value: "bulk", label: "Bulk or wedding order", hint: "50+ units, custom blends" },
  { value: "other", label: "Something else", hint: "press, stockists, collaborations" },
];

const BUDGETS = ["Under ₹2,000", "₹2,000 – ₹5,000", "₹5,000 – ₹15,000", "₹15,000 +"];

interface FormState {
  interest: Interest | "";
  budget: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
  consent: boolean;
}

const initial: FormState = {
  interest: "",
  budget: "",
  name: "",
  phone: "",
  email: "",
  city: "",
  message: "",
  consent: true,
};

export default function LeadForm({
  settings,
  defaultInterest,
}: {
  settings: Settings;
  defaultInterest?: string;
}) {
  const [step, setStep] = useState(defaultInterest ? 1 : 0);
  const [form, setForm] = useState<FormState>({
    ...initial,
    interest: (["personal", "gifting", "bulk", "other"].includes(defaultInterest ?? "")
      ? defaultInterest
      : "") as Interest | "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [reference, setReference] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validateStep(current: number) {
    const next: Record<string, string> = {};
    if (current === 0) {
      if (!form.interest) next.interest = "Choose what you are looking for.";
    }
    if (current === 1) {
      if (form.name.trim().length < 2) next.name = "Please tell us your name.";
      if (!/^[0-9+\s-]{10,16}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number.";
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) next.email = "That email looks off.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit() {
    if (!validateStep(1)) {
      setStep(1);
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          city: form.city,
          type: form.interest === "gifting" ? "gifting" : form.interest === "bulk" ? "bulk" : "enquiry",
          interest: `${form.interest}${form.budget ? ` · ${form.budget}` : ""}`,
          message: form.message,
          source: "contact-form",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "failed");
      setReference(data.id ?? "");
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="success">
        <div className="success__mark">
          <Check size={26} />
        </div>
        <h3 className="h3">Your note is with the atelier</h3>
        <p className="muted" style={{ maxWidth: "42ch", fontSize: 13.5, lineHeight: 1.7 }}>
          Thank you, {form.name.split(" ")[0]}. We reply within one working day — usually sooner. If it is
          urgent, WhatsApp is the fastest way to reach us.
        </p>
        {reference ? <span className="overline">Reference {reference}</span> : null}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          <a
            className="btn btn--gold"
            href={whatsappUrl(
              settings.whatsapp,
              `Hello Al Ibrahim Aroma, I just submitted an enquiry (${reference}). My name is ${form.name}.`,
            )}
            target="_blank"
            rel="noreferrer"
          >
            <Whatsapp size={15} /> Continue on WhatsApp
          </a>
          <button
            className="btn btn--line"
            onClick={() => {
              setForm(initial);
              setStep(0);
              setState("idle");
            }}
          >
            Send another note
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="steps">
        {["What you need", "Your details", "The note"].map((label, i) => (
          <div
            className="steps__item"
            key={label}
            data-state={step === i ? "active" : step > i ? "done" : "todo"}
          >
            <div className="steps__bar">
              <i />
            </div>
            <span className="steps__label">
              0{i + 1} · {label}
            </span>
          </div>
        ))}
      </div>

      {step === 0 ? (
        <div className="form-step">
          <div className="field" data-invalid={Boolean(errors.interest)}>
            <label>I am writing about</label>
            <div className="choice-grid">
              {INTERESTS.map((item) => (
                <button
                  type="button"
                  key={item.value}
                  className="choice"
                  data-on={form.interest === item.value}
                  onClick={() => set("interest", item.value)}
                >
                  <strong>{item.label}</strong>
                  <span>{item.hint}</span>
                </button>
              ))}
            </div>
            {errors.interest ? <span className="field__error">{errors.interest}</span> : null}
          </div>

          <div className="field">
            <label>Budget, roughly</label>
            <div className="filters">
              {BUDGETS.map((b) => (
                <button
                  type="button"
                  key={b}
                  className="chip"
                  data-active={form.budget === b}
                  onClick={() => set("budget", form.budget === b ? "" : b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
            <button
              className="btn btn--gold"
              onClick={() => {
                if (validateStep(0)) setStep(1);
              }}
            >
              Continue <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="form-step">
          <div className="form-grid">
            <div className="field" data-invalid={Boolean(errors.name)}>
              <label htmlFor="lf-name">Your name *</label>
              <input
                id="lf-name"
                className="input"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Ayesha Khan"
                autoComplete="name"
              />
              {errors.name ? <span className="field__error">{errors.name}</span> : null}
            </div>
            <div className="field" data-invalid={Boolean(errors.phone)}>
              <label htmlFor="lf-phone">Phone / WhatsApp *</label>
              <input
                id="lf-phone"
                className="input"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+91 98765 43210"
                inputMode="tel"
                autoComplete="tel"
              />
              {errors.phone ? <span className="field__error">{errors.phone}</span> : null}
            </div>
            <div className="field" data-invalid={Boolean(errors.email)}>
              <label htmlFor="lf-email">Email</label>
              <input
                id="lf-email"
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email ? <span className="field__error">{errors.email}</span> : null}
            </div>
            <div className="field">
              <label htmlFor="lf-city">City</label>
              <input
                id="lf-city"
                className="input"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Lucknow"
                autoComplete="address-level2"
              />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 6 }}>
            <button className="btn btn--line" onClick={() => setStep(0)}>
              Back
            </button>
            <button
              className="btn btn--gold"
              onClick={() => {
                if (validateStep(1)) setStep(2);
              }}
            >
              Continue <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="form-step">
          <div className="field">
            <label htmlFor="lf-message">Tell us a little more</label>
            <textarea
              id="lf-message"
              className="textarea"
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              placeholder="Scents you love, the occasion, quantities, a date you are working towards…"
            />
          </div>
          <label className="check">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => set("consent", e.target.checked)}
            />
            <span>
              I am happy to be contacted about this enquiry. We never share your details, and we do not
              send more than one letter a month.
            </span>
          </label>
          {state === "error" ? (
            <p className="field__error">
              Something went wrong sending your note. Please try again, or message us on WhatsApp.
            </p>
          ) : null}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <button className="btn btn--line" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              className="btn btn--gold"
              onClick={submit}
              disabled={state === "loading" || !form.consent}
            >
              {state === "loading" ? "Sending…" : "Send enquiry"} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
