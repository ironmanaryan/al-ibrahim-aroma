"use client";

import { useState } from "react";
import { Truck } from "./icons";

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

export default function PincodeCheck() {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [eta, setEta] = useState("");

  function check() {
    if (!/^\d{6}$/.test(pin)) {
      setStatus("err");
      setEta("");
      return;
    }
    const d = new Date();
    d.setDate(d.getDate() + 4);
    setEta(dateFmt.format(d));
    setStatus("ok");
  }

  return (
    <div className="pincode">
      <span className="overline">Delivery &amp; COD</span>
      <div className="pincode__row">
        <input
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="Enter 6-digit pincode"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, "").slice(0, 6));
            setStatus("idle");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") check();
          }}
          aria-label="Delivery pincode"
        />
        <button className="btn btn--line btn--sm" onClick={check}>
          Check
        </button>
      </div>
      {status === "ok" ? (
        <div className="pincode__ok">
          <Truck size={14} /> Delivers by {eta} · Cash on delivery available
        </div>
      ) : null}
      {status === "err" ? (
        <p className="pincode__err">Please enter a valid 6-digit Indian pincode.</p>
      ) : null}
      {status === "idle" ? (
        <p className="pincode__note">
          Free shipping above ₹999 · COD on orders under ₹5,000 · Dispatched within 24 hours from
          Lucknow.
        </p>
      ) : null}
    </div>
  );
}
