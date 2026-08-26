import Link from "next/link";
import { templatesFor, verticals, type VerticalId } from "@/lib/content";
import SceneCanvas from "./scene/SceneCanvas";
import TemplateFlow from "./TemplateFlow";

export default function VerticalPage({ id }: { id: VerticalId }) {
  const v = verticals[id];
  const first = templatesFor(id)[0];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 opacity-70">
          <SceneCanvas compact />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/40 to-ink" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 md:py-32">
          <p className="text-xs uppercase tracking-[0.22em] text-glow">{v.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.05] text-cream md:text-7xl">
            {v.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-mist">{v.lede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/demo?vertical=${id}&template=${first.id}`}
              className="btn-coral rounded-full px-6 py-3 text-sm font-medium"
            >
              Request a demo
            </Link>
            <Link
              href="/templates"
              className="rounded-full border border-line px-6 py-3 text-sm text-cream hover:border-mist"
            >
              Browse templates
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-4xl text-cream">The missed-call problem</h2>
          <ul className="mt-6 space-y-3 text-mist">
            {v.pains.map((p) => (
              <li key={p} className="border-l border-coral/70 pl-4 leading-7">
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-4xl text-cream">What Helora does instead</h2>
          <ul className="mt-6 space-y-3 text-mist">
            {v.wins.map((p) => (
              <li key={p} className="border-l border-glow/70 pl-4 leading-7">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-panel/40 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs uppercase tracking-[0.2em] text-glow">Same product</p>
          <h2 className="mt-3 font-serif text-4xl text-cream md:text-5xl">
            Start from a {v.label.toLowerCase()} template. Rewrite anything.
          </h2>
          <p className="mt-4 max-w-2xl text-mist leading-7">
            Helora is one engine. These flows are presets — adopt them as-is or
            change a rule in a sentence. Your floor, your voice.
          </p>
          <div className="mt-12">
            <TemplateFlow lockedVertical={id} />
          </div>
        </div>
      </section>
    </div>
  );
}
