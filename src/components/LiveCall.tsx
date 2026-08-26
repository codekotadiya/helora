"use client";

import { useEffect, useState } from "react";
import type { Turn } from "@/lib/content";

export default function LiveCall({
  sample,
  title,
}: {
  sample: Turn[];
  title: string;
}) {
  const [n, setN] = useState(1);

  useEffect(() => {
    setN(1);
    const id = window.setInterval(() => {
      setN((v) => (v >= sample.length ? 1 : v + 1));
    }, 2200);
    return () => window.clearInterval(id);
  }, [sample]);

  return (
    <div className="glow-ring overflow-hidden rounded-3xl border border-line bg-panel/80">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-mist">
          <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-coral" />
          Live call
        </div>
        <div className="text-xs text-muted">{title}</div>
      </div>
      <div className="flex flex-col gap-3 px-5 py-5 min-h-[280px]">
        {sample.slice(0, n).map((turn, i) => (
          <div
            key={`${turn.role}-${i}`}
            className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 rise ${
              turn.role === "ai"
                ? "bg-teal/25 text-cream"
                : "ml-auto bg-cream/10 text-cream"
            }`}
          >
            <div className="mb-1 text-[10px] uppercase tracking-[0.16em] text-mist">
              {turn.role === "ai" ? "Helora" : "Caller"}
            </div>
            {turn.text}
          </div>
        ))}
      </div>
    </div>
  );
}
