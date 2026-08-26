import { NextResponse } from "next/server";
import { templates } from "@/lib/content";

const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const business = String(body.business ?? "").trim();
  const city = String(body.city ?? "").trim();
  const vertical = String(body.vertical ?? "").trim();
  const templateId = String(body.templateId ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !phone || !business) {
    return NextResponse.json({ error: "Name, email, phone, and business are required." }, { status: 400 });
  }
  if (!emailOk.test(email)) {
    return NextResponse.json({ error: "Enter a real email." }, { status: 400 });
  }
  if (!["dentists", "restaurants", "hotels"].includes(vertical)) {
    return NextResponse.json({ error: "Pick a desk." }, { status: 400 });
  }
  if (templateId && !templates.some((t) => t.id === templateId)) {
    return NextResponse.json({ error: "Unknown template." }, { status: 400 });
  }

  console.log(
    JSON.stringify({
      type: "helora.demo",
      at: new Date().toISOString(),
      name,
      email,
      phone,
      business,
      city,
      vertical,
      templateId,
      message,
    }),
  );

  return NextResponse.json({ ok: true });
}
