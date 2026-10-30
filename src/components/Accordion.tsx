"use client";

import { useState } from "react";
import { Plus } from "./icons";

export default function Accordion({
  items,
}: {
  items: { title: string; content: React.ReactNode }[];
}) {
  const [open, setOpen] = useState(0);
  return (
    <div className="accordion">
      {items.map((item, i) => (
        <div className="accordion__item" data-open={open === i} key={item.title}>
          <button
            className="accordion__head"
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
          >
            {item.title}
            <Plus size={14} />
          </button>
          <div className="accordion__body">{item.content}</div>
        </div>
      ))}
    </div>
  );
}
