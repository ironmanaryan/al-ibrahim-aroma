import { NextRequest } from "next/server";
import { updateDB } from "@/lib/store";
import { uid } from "@/lib/utils";
import type { Lead, LeadItem, LeadStatus, LeadType } from "@/lib/types";

export const runtime = "nodejs";

const TYPES: LeadType[] = ["enquiry", "order", "callback", "bulk", "gifting"];

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const name = String(body.name ?? "").trim().slice(0, 80);
    const phone = String(body.phone ?? "").trim().slice(0, 24);
    if (name.length < 2 || !/[0-9]{6,}/.test(phone.replace(/\D/g, ""))) {
      return Response.json({ error: "Name and a valid phone number are required." }, { status: 400 });
    }

    const type = TYPES.includes(body.type as LeadType) ? (body.type as LeadType) : "enquiry";
    const items = Array.isArray(body.items) ? (body.items as LeadItem[]).slice(0, 30) : undefined;
    const total = typeof body.total === "number" ? body.total : undefined;

    const lead: Lead = {
      id: uid("l"),
      name,
      phone,
      email: body.email ? String(body.email).slice(0, 120) : undefined,
      city: body.city ? String(body.city).slice(0, 80) : undefined,
      type,
      interest: body.interest ? String(body.interest).slice(0, 160) : undefined,
      message: body.message ? String(body.message).slice(0, 2000) : undefined,
      items,
      total,
      status: "new" as LeadStatus,
      source: String(body.source ?? "website").slice(0, 40),
      createdAt: new Date().toISOString(),
    };

    await updateDB((db) => {
      db.leads.unshift(lead);
      if (type === "order") db.analytics.events.orders += 1;
      else db.analytics.events.leads += 1;
    });

    return Response.json({ id: lead.id, ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Could not save the enquiry." }, { status: 500 });
  }
}
