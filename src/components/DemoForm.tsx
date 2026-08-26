"use client";

import { useMemo, useState } from "react";
import { templates, type VerticalId } from "@/lib/content";

const verticals: VerticalId[] = ["dentists", "restaurants", "hotels"];

export default function DemoForm({
  presetVertical,
  presetTemplate,
}: {
  presetVertical?: string;
  presetTemplate?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  const initialVertical = useMemo(() => {
    if (presetVertical && verticals.includes(presetVertical as VerticalId)) {
      return presetVertical as VerticalId;
    }
    const fromTpl = templates.find((t) => t.id === presetTemplate);
    return fromTpl?.vertical ?? "dentists";
  }, [presetVertical, presetTemplate]);

  const [vertical, setVertical] = useState<VerticalId>(initialVertical);
  const [templateId, setTemplateId] = useState(
    presetTemplate && templates.some((t) => t.id === presetTemplate)
      ? presetTemplate
      : templates.find((t) => t.vertical === initialVertical)?.id ?? "",
  );

  const options = templates.filter((t) => t.vertical === vertical);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = new FormData(e.currentTarget);
    if (String(form.get("company_site") || "").length > 0) {
      setStatus("ok");
      return;
    }
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      business: String(form.get("business") || ""),
      city: String(form.get("city") || ""),
      vertical,
      templateId,
      message: String(form.get("message") || ""),
    };
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Could not send");
      }
      setStatus("ok");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send");
      setStatus("err");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-3xl border border-glow/40 bg-panel p-8">
        <div className="text-xs uppercase tracking-[0.18em] text-glow">Request received</div>
        <h2 className="mt-3 font-serif text-4xl text-cream">We’ll call you on your number.</h2>
        <p className="mt-4 max-w-md text-mist leading-7">
          Helora will walk the template you picked, then show you how to rewrite it
          in a sentence. Watch your inbox — and pick up.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative rounded-3xl border border-line bg-panel/80 p-6 md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-mist">
          Your name
          <input
            required
            name="name"
            className="mt-2 w-full rounded-xl border border-line bg-ink px-3 py-2.5 text-cream outline-none focus:border-glow"
          />
        </label>
        <label className="block text-sm text-mist">
          Work email
          <input
            required
            type="email"
            name="email"
            className="mt-2 w-full rounded-xl border border-line bg-ink px-3 py-2.5 text-cream outline-none focus:border-glow"
          />
        </label>
        <label className="block text-sm text-mist">
          Mobile
          <input
            required
            name="phone"
            className="mt-2 w-full rounded-xl border border-line bg-ink px-3 py-2.5 text-cream outline-none focus:border-glow"
          />
        </label>
        <label className="block text-sm text-mist">
          Business
          <input
            required
            name="business"
            className="mt-2 w-full rounded-xl border border-line bg-ink px-3 py-2.5 text-cream outline-none focus:border-glow"
          />
        </label>
        <label className="block text-sm text-mist">
          City
          <input
            name="city"
            className="mt-2 w-full rounded-xl border border-line bg-ink px-3 py-2.5 text-cream outline-none focus:border-glow"
          />
        </label>
        <label className="block text-sm text-mist">
          Desk
          <select
            value={vertical}
            onChange={(e) => {
              const v = e.target.value as VerticalId;
              setVertical(v);
              setTemplateId(templates.find((t) => t.vertical === v)?.id ?? "");
            }}
            className="mt-2 w-full rounded-xl border border-line bg-ink px-3 py-2.5 text-cream outline-none focus:border-glow"
          >
            <option value="dentists">Dentists</option>
            <option value="restaurants">Restaurants</option>
            <option value="hotels">Hotels</option>
          </select>
        </label>
      </div>
      <label className="mt-4 block text-sm text-mist">
        Start from this template
        <select
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className="mt-2 w-full rounded-xl border border-line bg-ink px-3 py-2.5 text-cream outline-none focus:border-glow"
        >
          {options.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-4 block text-sm text-mist">
        What should Helora handle first?
        <textarea
          name="message"
          rows={4}
          className="mt-2 w-full rounded-xl border border-line bg-ink px-3 py-2.5 text-cream outline-none focus:border-glow"
          placeholder="After-hours emergencies, Saturday reservations, overnight front desk…"
        />
      </label>
      <div className="absolute -left-[9999px]" aria-hidden>
        <input tabIndex={-1} autoComplete="off" name="company_site" />
      </div>
      {error ? <p className="mt-3 text-sm text-coral">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-coral mt-6 w-full rounded-full px-5 py-3 text-sm font-medium disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Request a demo"}
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        We’ll use this to book a live test call on your number. No IVR. No pitch deck first.
      </p>
    </form>
  );
}
