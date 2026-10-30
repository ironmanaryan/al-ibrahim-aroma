"use client";

import { useState } from "react";
import type { Faq } from "@/lib/types";
import { Plus } from "./icons";

export default function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="faq">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div className="faq__item" data-open={isOpen} key={item.id}>
            <button
              className="faq__q"
              onClick={() => setOpen(isOpen ? null : item.id)}
              aria-expanded={isOpen}
            >
              {item.question}
              <i>
                <Plus size={14} />
              </i>
            </button>
            <div className="faq__a">
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
