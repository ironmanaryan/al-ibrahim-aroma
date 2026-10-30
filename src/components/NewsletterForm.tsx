"use client";

import { useState } from "react";
import { ArrowRight, Check } from "./icons";

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setState("error");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="newsletter-done">
        <Check size={16} />
        <span>You are on the list. Watch your inbox for the next distillation.</span>
      </div>
    );
  }

  return (
    <form className="newsletter-form" onSubmit={submit} noValidate>
      <input
        className="input"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (state === "error") setState("idle");
        }}
        placeholder="Your email address"
        aria-label="Email address"
        required
      />
      <button className="btn btn--gold" type="submit" disabled={state === "loading"}>
        {state === "loading" ? "Adding…" : compact ? "Join" : "Subscribe"}
        <ArrowRight size={14} />
      </button>
      {state === "error" ? (
        <span className="field__error">Please enter a valid email address.</span>
      ) : null}
    </form>
  );
}
