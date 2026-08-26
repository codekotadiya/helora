"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { templates, templatesFor, type Template, type VerticalId } from "@/lib/content";
import LiveCall from "./LiveCall";

const tabs: { id: VerticalId | "all"; label: string }[] = [
  { id: "all", label: "All desks" },
  { id: "dentists", label: "Dentists" },
  { id: "restaurants", label: "Restaurants" },
  { id: "hotels", label: "Hotels" },
];

export default function TemplateFlow({
  initial,
  lockedVertical,
}: {
  initial?: string;
  lockedVertical?: VerticalId;
}) {
  const pool = useMemo(
    () => (lockedVertical ? templatesFor(lockedVertical) : templates),
    [lockedVertical],
  );
  const [tab, setTab] = useState<VerticalId | "all">(lockedVertical ?? "all");
  const visible = tab === "all" ? pool : pool.filter((t) => t.vertical === tab);
  const [activeId, setActiveId] = useState(initial ?? visible[0]?.id ?? pool[0].id);
  const active: Template = visible.find((t) => t.id === activeId) ?? visible[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <div>
        {lockedVertical ? null : (
          <div className="mb-4 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTab(t.id);
                  const next = t.id === "all" ? pool : pool.filter((x) => x.vertical === t.id);
                  if (next[0]) setActiveId(next[0].id);
                }}
                className={`rounded-full px-3 py-1.5 text-xs tracking-wide ${
                  tab === t.id
                    ? "bg-cream text-ink"
                    : "border border-line text-mist hover:text-cream"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-2">
          {visible.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveId(t.id)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                active.id === t.id
                  ? "border-glow/60 bg-teal/20"
                  : "border-line bg-panel/50 hover:border-mist/40"
              }`}
            >
              <div className="text-[11px] uppercase tracking-[0.16em] text-mist">
                {t.vertical}
              </div>
              <div className="mt-1 font-medium text-cream">{t.name}</div>
              <p className="mt-1 text-sm leading-5 text-mist">{t.summary}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-line bg-panel/70 p-5">
          <div className="text-xs uppercase tracking-[0.18em] text-mist">Conversation flow</div>
          <h3 className="mt-2 font-serif text-3xl text-cream">{active.name}</h3>
          <p className="mt-2 text-sm leading-6 text-mist">{active.summary}</p>
          <ol className="mt-6 space-y-3">
            {active.nodes.map((node, i) => (
              <li key={node.id} className={`node-${node.type} flex gap-3`}>
                <div className="flex flex-col items-center">
                  <span
                    className="mt-1 h-2.5 w-2.5 rounded-full"
                    style={{ background: "var(--tone)" }}
                  />
                  {i < active.nodes.length - 1 ? (
                    <span className="mt-1 w-px flex-1 bg-line" />
                  ) : null}
                </div>
                <div className="pb-3">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-mist">
                    {node.label}
                  </div>
                  <div className="text-sm leading-6 text-cream">{node.say}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4 rounded-2xl border border-line bg-ink/60 p-4">
            <div className="text-[11px] uppercase tracking-[0.16em] text-glow">
              Adopt or rewrite
            </div>
            <p className="mt-2 font-serif text-lg leading-7 text-cream">
              “{active.adoptHint}”
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <LiveCall sample={active.sample} title={active.name} />
          <Link
            href={`/demo?template=${active.id}&vertical=${active.vertical}`}
            className="btn-coral inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium"
          >
            Use this template in a demo
          </Link>
        </div>
      </div>
    </div>
  );
}
